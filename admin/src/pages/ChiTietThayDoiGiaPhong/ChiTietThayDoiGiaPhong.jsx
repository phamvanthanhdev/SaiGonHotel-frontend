import React, { useContext, useEffect, useState } from 'react'
import './ChiTietThayDoiGiaPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ThemThayDoiGiaPhongPopup from '../../components/QuanLy/ThemThayDoiGiaPhongPopup/ThemThayDoiGiaPhongPopup';

const ChiTietThayDoiGiaPhong = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [chiTietGiaPhongs, setChiTietGiaPhongs] = useState([]);
    const [showThemThayDoiGiaPhongPopup, setShowThemThayDoiGiaPhongPopup] = useState(false);
    const [isCapNhat, setIsCapNhat]= useState(false);
    const [idHangPhong, setIdHangPhong] = useState();
    const [ngayCapNhat, setNgayCapNhat] = useState();
    const [idNhanVien, setIdNhanVien] = useState();

    const getChiTietGiaPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/chi-tiet-gia-phong/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setChiTietGiaPhongs(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            getChiTietGiaPhongs();
        }
    }, [token])

    const onClickThemThayDoiGiaPhong = ()=>{
        setIsCapNhat(false);
        setShowThemThayDoiGiaPhongPopup(true);
    }

    const onClickCapNhatThayDoiGiaPhong = (idHangPhong, idNhanVien, ngayCapNhat)=>{
        setIdHangPhong(idHangPhong);
        setIdNhanVien(idNhanVien);
        setNgayCapNhat(ngayCapNhat);
        setIsCapNhat(true);
        setShowThemThayDoiGiaPhongPopup(true);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showThemThayDoiGiaPhongPopup &&
                        <ThemThayDoiGiaPhongPopup
                            setShowThemThayDoiGiaPhongPopup={setShowThemThayDoiGiaPhongPopup}
                            isCapNhat={isCapNhat}
                            idHangPhong={idHangPhong}
                            idNhanVien={idNhanVien}
                            ngayCapNhat={ngayCapNhat}
                            setChiTietGiaPhongs={setChiTietGiaPhongs}
                        />
                    }
                    <Navbar />
                    <main className='hang-phong'>
                        <div className="hang-phong-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách chi tiết thay đổi giá phòng</h3>
                                    <button onClick={onClickThemThayDoiGiaPhong} className='btn btn-primary'>Thêm chi tiết</button>
                                </div>
                                {chiTietGiaPhongs.length > 0 ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Tên hạng phòng</th>
                                                <th>Giá cập nhật</th>
                                                <th>Ngày áp dụng</th>
                                                <th>Ngày cập nhật</th>
                                                <th>Trạng thái</th>
                                                <th>Người cập nhật</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                chiTietGiaPhongs.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index+1}.</td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.giaCapNhat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{convertDateShow(item.ngayApDung)}</td>
                                                            <td>{convertDateShow(item.ngayCapNhat)}</td>
                                                            <td>{item.dangApDung ? 'Đang áp dụng': 'Không áp dụng'}</td>
                                                            <td>{item.tenNhanVien}</td>
                                                            <td><button onClick={()=>onClickCapNhatThayDoiGiaPhong(item.idHangPhong, item.idNhanVien, item.ngayCapNhat)} className='btn btn-primary'>Cập nhật</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    : <p className='error'>Chưa có lần thay đổi giá hạng phòng nào</p>}
                            </div>

                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default ChiTietThayDoiGiaPhong