import React, { useContext, useEffect, useState } from 'react'
import './PhieuDatDetails.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HangPhongPopup from '../../components/HangPhongPopup/HangPhongPopup'
import DaiDienPopup from '../../components/DaiDienPopup/DaiDienPopup'

const PhieuDatDetails = () => {
    const id = useParams().id;
    const { url, token, isExpand } = useContext(StoreContext);
    const [phieuDat, setPhieuDat] = useState();
    const [showHangPhongPopup, setShowHangPhongPopup] = useState(false);
    const [showDaiDienPopup, setShowDaiDienPopup] = useState(false);
    const [idNguoiDaiDien, setIdNguoiDaiDien] = useState();
    const [tenNguoiDaiDien, setTenNguoiDaiDien] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const getPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setPhieuDat(response.data);
            setIdNguoiDaiDien(response.data.idKhachHang);
            setTenNguoiDaiDien(response.data.hoTen);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(token){
            getPhieuDat();
        }
    }, [id, token])

    const removeHangPhong = async(data) => {
        try {
            const response = await axios.post(url + "/api/phieu-dat/chi-tiet/xoa", data, { headers: { Authorization: `Bearer ${token}` } });
            if(response.data.code === 200){
                getPhieuDat();
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const handleRemove = (idHangPhong) =>{
        const data = {
            idHangPhong: idHangPhong,
            idPhieuDat: phieuDat.idPhieuDat,
            soLuong: 1,
            donGia: 0
        }

        removeHangPhong(data);
    }

    const taoPhieuThue = async() => {
        if(phieuDat.trangThaiHuy !== 0){
            setErrorMessage("Phiếu đặt đã hoàn tất hoặc đã hủy trước đó");
        }else{
            const phieuThueRequest = {
                ngayDen: phieuDat.ngayBatDau,
                ngayDi: phieuDat.ngayTraPhong,
                idKhachHang: idNguoiDaiDien,
                idPhieuDat: phieuDat.idPhieuDat,
                chiTietRequests: []
            }
            try {
                const response = await axios.post(url + "/api/phieu-thue/", phieuThueRequest, { headers: { Authorization: `Bearer ${token}` } });
                if(response.data.code === 200){
                    navigate(`/phieu-thue`,{ state: { idPhieuDat: id, idPhieuThue: response.data.result.idPhieuThue } })
                }else{
                    setErrorMessage(response.data.message)
                }
            } catch (error) {
                console.log(error.response.data.message);
                setErrorMessage(error.response.data.message)
            }
        }
    }
    

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    {showHangPhongPopup?<HangPhongPopup 
                        setShowHangPhongPopup={setShowHangPhongPopup} 
                        ngayNhanPhong={phieuDat.ngayBatDau}
                        ngayTraPhong={phieuDat.ngayTraPhong}
                        idPhieuDat={phieuDat.idPhieuDat}
                        setPhieuDat={setPhieuDat}/>:<></>}
                    
                    {showDaiDienPopup ? <DaiDienPopup setShowDaiDienPopup={setShowDaiDienPopup} 
                    setIdNguoiDaiDien={setIdNguoiDaiDien}
                    setTenNguoiDaiDien={setTenNguoiDaiDien}/>: <></>}
                    <main>
                        {phieuDat &&
                        <div className="table-data">
                            <div className="order">
                                <div className="head">
                                    <h3>Chi tiết phiếu đặt phòng - {phieuDat.idPhieuDat}</h3>
                                </div>
                                <div className='content'>
                                    <p>Thời gian: {phieuDat.ngayBatDau} đến {phieuDat.ngayTraPhong}</p>
                                    <p>Người đặt phòng: {phieuDat.hoTen}</p>
                                    <p>Tiền tạm ứng: {phieuDat.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Tổng giá trị: {phieuDat.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Trạng thái: {phieuDat.trangThaiHuy === 0 &&  "Chờ xử lý"}
                                                    {phieuDat.trangThaiHuy === 1 && "Hoàn thành"}
                                                    {phieuDat.trangThaiHuy === 2 && "Đã hủy"}
                                    </p>
                                    <p>Lưu ý của khách hàng: {phieuDat.ghiChu}</p>
                                    <p>Thời gian đặt: {phieuDat.ngayTao}</p>
                                    <p>Người đại diện: {tenNguoiDaiDien}</p>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="btn">
                                        <button onClick={() => setShowDaiDienPopup(true)} className='btn btn-primary'>Chọn khách hàng đại diện</button>
                                    </div>
                                    <button onClick={taoPhieuThue} className='btn btn-primary' >Xác nhận và chọn phòng</button>
                                   
                                </div>
                            </div>
                            <div className="todo">
                                <div className="head">
                                    <h3>Hạng phòng đã đặt</h3>
                                    <i className='bx bx-plus' ><FontAwesomeIcon onClick={() => setShowHangPhongPopup(true)} icon={faPlus} /></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <ul className="todo-list">
                                    {phieuDat.chiTietResponses.map((item, index) => {
                                        return(
                                            <li key={index} className="completed">
                                                <p>{item.tenHangPhong}</p>
                                                <p>x{item.soLuong}</p>
                                                <p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                <FontAwesomeIcon onClick={()=>handleRemove(item.idHangPhong)} className='bx' icon={faXmark} />
                                            </li>
                                        )
                                    })}

                                </ul>
                            </div>
                        </div>
                        }
                    </main>
                </section>
            </div>
        </>
    )
}

export default PhieuDatDetails