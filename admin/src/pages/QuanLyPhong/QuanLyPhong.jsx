import React, { useContext, useEffect, useState } from 'react'
import './QuanLyPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuanLyPhong = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [showThemPhongPopup, setShowThemPhongPopup] = useState(false);
    const [isCapNhat, setIsCapNhat]= useState(false);
    const [phongs, setPhongs] = useState([]);

    const getPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/phong/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setPhongs(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getPhongs();
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='hang-phong'>
                        <div className="hang-phong-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách phòng hiện tại</h3>
                                    <button onClick={()=>navigate("/them-phong")} className='btn btn-primary'>Thêm phòng</button>
                                </div>
                                {phongs.length > 0 ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Mã phòng</th>
                                                <th>Tên hạng phòng</th>
                                                <th>Tầng</th>
                                                <th>Sức chứa</th>
                                                <th>Giá khuyến mãi</th>
                                                <th>Giá gốc</th>
                                                <th>Trạng thái</th>
                                                <th>Đã thuê</th>
                                                <th>Ngày tạo</th>
                                                <th>Ngày cập nhật</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                phongs.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.maPhong}</td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.tang}</td>
                                                            <td>{item.soNguoiToiDa} người</td>
                                                            <td>{item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.tenTrangThai}</td>
                                                            <td>{item.daThue ? 'Đang thuê' : 'Đang trống'}</td>
                                                            <td>{convertDateShow(item.ngayTao)}</td>
                                                            <td>{convertDateShow(item.ngayCapNhat)}</td>
                                                            <td><button onClick={()=>navigate('/cap-nhat-phong/'+ item.maPhong)} className='btn btn-primary'>Cập nhật</button></td>
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

export default QuanLyPhong