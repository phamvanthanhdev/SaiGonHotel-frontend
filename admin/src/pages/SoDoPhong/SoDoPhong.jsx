import React, { useContext, useEffect, useState } from 'react'
import './SoDoPhong.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import TrangThaiPhongPopup from '../../components/TrangThaiPhongPopup/TrangThaiPhongPopup'

const SoDoPhong = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phongSapXeps, setPhongSapXeps] = useState([]);

    const [showTrangThaiPopup, setShowTrangThaiPopup] = useState(false);
    const [maPhong, setMaPhong] = useState();               // Mã phòng được chọn để cập nhật trạng thái
    const [tenTrangThai, setTenTrangThai] = useState();     // Trạng thái hiện tại của phòng

    const getPhongSapXeps = async () => {
        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hien-tai/sap-xep", { headers: { Authorization: `Bearer ${token}` } });
            console.log(response.data);
            setPhongSapXeps(response.data.result)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getPhongSapXeps();
        }
    }, [token])

    const handleClickThongTin = async (idPhieuThue, daThue) => {
        if(daThue){
            navigate(`/chi-tiet-phieu-thue`, { state: { idPhieuThue } });
        }else{
            toast.error("Phòng này đang trống");
        }
    }

    const handleCapNhatTrangThai = async (maPhong, tenTrangThai, daThue) => {
        if(daThue){
            toast.error("Phòng này đang được cho thuê. Không thể thay đổi trạng thái")
        }else{
            setMaPhong(maPhong);
            setTenTrangThai(tenTrangThai);
            setShowTrangThaiPopup(true);
        }
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showTrangThaiPopup ? 
                        <TrangThaiPhongPopup
                            maPhong={maPhong}
                            trangThaiHienTai={tenTrangThai}
                            setShowTrangThaiPopup={setShowTrangThaiPopup}
                            setPhongSapXeps={setPhongSapXeps}
                        />
                        :<></>
                    }
                    <Navbar />
                    <main>
                        <div className="head-title">
                            <div className="right">
                                <h2>Sơ đồ phòng</h2>
                            </div>

                            <div className="left">

                                <ul className="breadcrumb">
                                    <li>
                                        <button onClick={() => navigate("/tao-phieu-thue")} className='btn btn-primary'>Tạo phiếu thuê</button>
                                    </li>
                                    <li>
                                        <button className='btn btn-primary'>Đặt phòng</button>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div className="chu-giai">
                            <div className="white">
                                <div className='color'></div>
                                <p>Sẵn sàng cho thuê</p>
                            </div>
                            <div className="blue">
                                <div className='color'></div>
                                <p>Đang cho thuê</p>
                            </div>
                            <div className="yellow">
                                <div className='color'></div>
                                <p>Đang dọn dẹp</p>
                            </div>
                            <div className="red">
                                <div className='color'></div>
                                <p>Đang sửa chữa</p>
                            </div>
                           
                        </div>
                        <div className="sodo-container">
                            {
                                phongSapXeps && phongSapXeps.map((item, index) => {
                                    return (
                                        <>
                                        {item.thongTinPhongs.length > 0  && <p className='head'>{item.tenHangPhong}</p>}
                                        <div key={index} className="hangPhong">
                                            {item.thongTinPhongs.length > 0 &&
                                                item.thongTinPhongs.map((item, index) => {
                                                return (
                                                    <div key={index} className={`phong ${item.daThue && 'da-thue'} ${item.tenTrangThai === "Đang dọn dẹp" && 'khong-sach'} ${item.tenTrangThai === "Đang sửa chữa" && 'dang-sua-chua'} dropdown`}>
                                                        <h5>{item.maPhong}</h5>
                                                        <p>Thuộc tầng {item.tang}</p>
                                                        <p>{item.giaKhuyenMai > 0
                                                            ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                                            : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                                        }
                                                            &nbsp;
                                                            {item.giaKhuyenMai > 0 && <del>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>}
                                                        </p>
                                                        <span>{!item.daThue ? item.tenTrangThai : `Trả phòng ${convertDateShow(item.ngayDi)}`}</span>


                                                        <div class="dropdown-content">
                                                            <span onClick={() => handleClickThongTin(item.idPhieuThue, item.daThue)}>Thông tin thuê</span>
                                                            <span onClick={()=> handleCapNhatTrangThai(item.maPhong, item.tenTrangThai, item.daThue)}>Cập nhật trạng thái</span>
                                                        </div>

                                                    </div>
                                                )
                                                })
                                            }
                                        </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default SoDoPhong