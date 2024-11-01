import React, { useContext, useEffect, useState } from 'react'
import './CapNhatPhieuThue.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { format } from "date-fns";

const CapNhatPhieuThue = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [idPhieuThue, setIdPhieuThue] = useState(id);
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuThue, setPhieuThue] = useState();
    const [chiTietPhieuThues, setChiTietPhieuThues] = useState([]);
    const [chiTietDichVus, setChiTietDichVus] = useState([]);
    const [chiTietPhuThus, setChiTietPhuThus] = useState([]);

    const fetchPhieuThue = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-thue/cap-nhat/${idPhieuThue}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setPhieuThue(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const fetchChiTietPhieuThues = async () => {
        try {
            const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setChiTietPhieuThues(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchChiTietPhieuThues();
            fetchPhieuThue();
            fetchChiTietDichVus();
            fetchChiTietPhuThus();
        }
    }, [token])

    const fetchChiTietDichVus = async () => {
    	try {
            const config = {
                params: {idPhieuThue},
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.get(url + `/api/dich-vu/chi-tiet/phieu-thue`, config);
            if(response.data.code === 200)
    		    setChiTietDichVus(response.data.result);
            else
                toast.error(response.data.message);
    	} catch (error) {
    		console.log(error.message);
    		toast.error(error.message);
    	}
    }

    const fetchChiTietPhuThus = async () => {
    	try {
            const config = {
                params: {idPhieuThue},
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.get(url + `/api/phu-thu/chi-tiet/phieu-thue`, config);
            if(response.data.code === 200)
    		    setChiTietPhuThus(response.data.result);
            else
                toast.error(response.data.message);
    	} catch (error) {
    		console.log(error.message);
    		toast.error(error.message);
    	}
    }

    const xoaPhieuThue = async () => {
    	try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.delete(url + `/api/phieu-thue/` + idPhieuThue, config);
            if(response.data.code === 200){
    		    toast.success("Xóa phiếu thuê thành công");
                navigate("/quan-ly-phieu-thue");
            }else
                toast.error(response.data.message);
    	} catch (error) {
    		console.log(error.message);
    		toast.error(error.response.data.message);
    	}
    }


    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='cap-nhat-phieu-thue'>
                        {phieuThue &&
                            <div className="cap-nhat-phieu-thue-container">
                                <div className="todo">
                                    <div className="phieu-thue">
                                        <div className="head">
                                            <h3>Thông tin phiếu thuê - {idPhieuThue}</h3>
                                            <i className='bx bx-plus' ></i>
                                            <i className='bx bx-filter' ></i>
                                        </div>
                                        <div className="information">
                                            <ul>
                                                <li>
                                                    <p>Lưu trú:</p>
                                                    <p>từ {convertDateShow(phieuThue.ngayDen)} đến {convertDateShow(phieuThue.ngayDi)}</p>
                                                </li>
                                                <li>
                                                    <p>Tổng tiền phòng:</p>
                                                    <p>{phieuThue.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Tổng tiền dịch vụ:</p>
                                                    <p>{phieuThue.tongTienDichVu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Tổng tiền phụ thu:</p>
                                                    <p>{phieuThue.tongTienPhuThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Tiền tạm ứng:</p>
                                                    <p>{phieuThue.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Tiền tiền tất cả:</p>
                                                    <p>{phieuThue.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Giảm giá tiền phòng:</p>
                                                    <p>{phieuThue.tienDuocGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                {/* <li>
                                                    <p>Tiền phải trả:</p>
                                                    <p>{phieuThue.tienPhaiTra.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li> */}
                                                <li>
                                                    <p>Phần trăm giảm:</p>
                                                    <p>{phieuThue.phanTramGiam}%</p>
                                                </li>
                                                <li>
                                                    <button onClick={()=>xoaPhieuThue()} className='btn btn-danger'>Xóa phiếu thuê</button>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>

                                </div>

                                <div className="order">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Tên hạng phòng</th>
                                                <th>Mã phòng</th>
                                                <th>Ngày nhận phòng</th>
                                                <th>Ngày trả phòng</th>
                                                <th>Đơn giá</th>
                                                <th>Giảm giá</th>
                                                <th>Tiền phòng</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                chiTietPhieuThues.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index+1}.</td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.maPhong}</td>
                                                            <td>{convertDateShow(item.ngayDen)}</td>
                                                            <td>{convertDateShow(item.ngayDi)}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.tienGiamGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>

                                    <table>
                                        <thead>
                                            <tr>
                                                
                                                <th>Tên dịch vụ/phụ thu</th>
                                                <th>Số lượng</th>
                                                <th>Đơn giá</th>
                                                <th>Tổng tiền</th>
                                                <th>Phòng sử dụng</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                chiTietDichVus.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            
                                                            <td>{item.tenDichVu}</td>
                                                            <td>{item.soLuong}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.maPhong}</td>
                                                            <td>{convertDateShow(item.ngayTao)}</td>
                                                            <td>{item.daThanhToan ? 'Đã thanh toán': 'Chưa thanh toán'}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {chiTietPhuThus.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            
                                                            <td>{item.noiDung}</td>
                                                            <td>{item.soLuong}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.maPhong}</td>
                                                            <td>{convertDateShow(item.ngayTao)}</td>
                                                            <td>{item.daThanhToan ? 'Đã thanh toán': 'Chưa thanh toán'}</td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>


                                    
                                </div>

                            </div>
                        }
                    </main>
                </section>
            </div>
        </>
    )
}

export default CapNhatPhieuThue