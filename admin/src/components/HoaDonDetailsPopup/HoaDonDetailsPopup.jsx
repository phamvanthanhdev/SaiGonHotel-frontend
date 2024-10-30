import React, { useContext, useEffect, useState } from 'react'
import './HoaDonDetailsPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const HoaDonDetailsPopup = ({ setShowHoaDonPopup, soHoaDon }) => {
    const { token, url, convertDateShow } = useContext(StoreContext);
    const [data, setData] = useState();


    const getHoaDon = async () => {
        try {
            const response = await axios.get(url + `/api/hoa-don/${soHoaDon}`, { headers: { Authorization: `Bearer ${token}` } });
            setData(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHoaDon();
        }
    }, [token])

    return (
        <div className='hoadon-popup'>
            <div action="" className="hoadon-popup-container">
                <div className="hoadon-popup-title">
                    <h2>Chi tiết hóa đơn</h2>
                    <FontAwesomeIcon onClick={() => setShowHoaDonPopup(false)} className="close" icon={faXmark} />
                </div>
                {data &&
                    <div className="table-data">
                        <div className="todo">
                            <div className="head">
                                <p>Thông tin</p>
                            </div>
                            <ul className="todo-list">
                                <div className='todo-left'>
                                    <li className="completed">
                                        <p>Số hóa đơn</p>
                                        <p>{data.soHoaDon}</p>
                                    </li>
                                    <li className="completed">
                                        <p>Ngày tạo</p>
                                        <p>{convertDateShow(data.ngayTao)}</p>
                                    </li>
                                    <li className="not-completed">
                                        <p>Nhân viên lập phiếu</p>
                                        <p>{data.tenNhanVien}</p>
                                    </li>
                                    <li className="completed">
                                        <p>Khách hàng đại diện</p>
                                        <p>{data.hoTenKhach}</p>
                                    </li>

                                </div>
                                <div className='todo-left'>
                                    <li className="completed">
                                        <p>Mã phiếu thuê</p>
                                        <p>{data.idPhieuThue}</p>
                                    </li>
                                    <li className="completed">
                                        <p>Lưu trú</p>
                                        <p>từ {convertDateShow(data.ngayNhanPhong)} đến {convertDateShow(data.ngayTraPhong)}</p>
                                    </li>
                                    <li className="not-completed">
                                        <p>Tổng thu</p>
                                        <p>{data.tongThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    </li>
                                    <li className="completed">
                                        <p>Thực thu</p>
                                        <p>{data.thucThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    </li>

                                </div>
                            </ul>
                            <button className='btn btn-primary'>In hóa đơn</button>
                        </div>

                        <div className="order">
                            <p className='head'>Danh sách phòng đã đặt</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Hạng phòng</th>
                                        <th>Mã phòng</th>
                                        <th>Thời gian</th>
                                        <th>Đơn giá</th>
                                        <th>Giảm giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.chiTietPhieuThues.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                
                                                <td>{item.tenHangPhong}</td>
                                                <td>{item.maPhong}</td>
                                                <td>{convertDateShow(item.ngayDen)} đến {convertDateShow(item.ngayDi)}</td>
                                                <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{item.tienGiamGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{item.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>


                            <p className='head'>Dịch vụ/Phụ thu</p>
                            <table>
                                <thead>
                                    <tr>
                                        
                                        <th>Tên</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.chiTietDichVus.map((item, index) => {
                                        return (
                                            <tr key={`DV${index}`}>
                                                
                                                <td>{item.tenDichVu}</td>
                                                <td>{item.soLuong}</td>
                                                <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{convertDateShow(item.ngayTao)}</td>
                                            </tr>
                                        )
                                    })}
                                    {data.chiTietPhuThus.map((item, index) => {
                                        return (
                                            <tr key={`PT${index}`}>
                                                
                                                <td>{item.noiDung}</td>
                                                <td>{item.soLuong}</td>
                                                <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{convertDateShow(item.ngayTao)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>


                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export default HoaDonDetailsPopup