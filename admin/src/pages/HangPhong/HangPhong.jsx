import React, { useContext, useEffect, useState } from 'react'
import './HangPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HangPhong = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [ hangPhongs, setHangPhongs ] = useState([]);

    const getHangPhongs = async()=>{
        try {
            const response = await axios.get(url + "/api/thong-tin-hang-phong/all", 
                {headers: {Authorization: `Bearer ${token}`}}
            );
            if(response.data.code === 200){
                setHangPhongs(response.data.result);
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    useEffect(()=>{
        if(token){
            getHangPhongs();
        }
    }, [token])

    const onClickThemHangPhong = ()=>{
        navigate("/them-hang-phong");
    }

    const onClickCapNhatHangPhong = (idHangPhong)=>{
        navigate("/cap-nhat-hang-phong/"+idHangPhong);
    }

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
                                    <h3>Danh sách hạng phòng</h3>
                                    <button onClick={()=>onClickThemHangPhong()} className='btn btn-primary'>Thêm hạng phòng</button>
                                </div>
                                {hangPhongs.length > 0 ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Mã</th>
                                                <th>Hình ảnh</th>
                                                <th>Tên hạng phòng</th>
                                                <th>Kiểu phòng</th>
                                                <th>Loại phòng</th>
                                                <th>Sức chứa</th>
                                                <th>Giá gốc</th>
                                                <th>Giá khuyến mãi</th>
                                                <th>Giảm giá</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                hangPhongs.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.idHangPhong}</td>
                                                            <td>
                                                                <img src={`data:image/png;base64, ${item.hinhAnh}`} alt="" className="siImg"/>
                                                            </td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.tenKieuPhong}</td>
                                                            <td>{item.tenLoaiPhong}</td>
                                                            <td>{item.soNguoiToiDa} người</td>
                                                            <td>{item.giaGoc ? item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 'Chưa cập nhật'}</td>
                                                            <td>{item.giaKhuyenMai ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 'Chưa cập nhật'}</td>
                                                            <td>{item.phanTramGiam} %</td>
                                                            <td><button onClick={()=>onClickCapNhatHangPhong(item.idHangPhong)} className='btn btn-primary'>Cập nhật</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    : <p className='error'>Không có hạng phòng nào</p>}
                            </div>

                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default HangPhong