import React, { useContext, useEffect, useState } from 'react'
import './SoDoPhong.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SoDoPhong = () => {
    const navigate = useNavigate();
    const { url, token, isExpand } = useContext(StoreContext);
    const [phongs, setPhongs] = useState([]);

    const getPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hien-tai", { headers: { Authorization: `Bearer ${token}` } });
            console.log(response.data);
            setPhongs(response.data)
        } catch (error) {
            console.log(error.message);
            // toast.error(error.message);
        }
    }

    useEffect(() => {
        getPhongs();
    }, [token])

    const handleClickThongTin = async (idPhieuThue) => {
        navigate(`/chi-tiet-phieu-thue`, { state: { idPhieuThue } });
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main>
                        <div className="sodo-container">
                            {
                                phongs && phongs.map((item, index) => {
                                    return (
                                        <div key={index} className={`phong ${item.daThue && 'da-thue'} ${item.tenTrangThai !== "Sạch sẽ" && 'khong-sach'} dropdown`}>
                                            <h2>{item.maPhong}</h2>
                                            <p>{item.tenHangPhong}</p>
                                            <p>{item.giaKhuyenMai > 0
                                                ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                                : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                            }
                                                &nbsp;
                                                {item.giaKhuyenMai > 0 && <del>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>}
                                            </p>
                                            <span>{item.tenTrangThai}</span>

                                    
                                            <div class="dropdown-content">
                                                <span onClick={()=>handleClickThongTin(item.idPhieuThue)}>Thông tin</span>
                                                <span>Cập nhật trạng thái</span>
                                                <span>Link 3</span>
                                            </div>

                                        </div>
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