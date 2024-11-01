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
import HuyPhongPopup from '../../components/HuyPhongPopup/HuyPhongPopup'

const PhieuDatDetails = () => {
    const id = useParams().id;
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuDat, setPhieuDat] = useState();
    const [showHangPhongPopup, setShowHangPhongPopup] = useState(false);
    const [showDaiDienPopup, setShowDaiDienPopup] = useState(false);
    const [showHuyPhongPopup, setShowHuyPhongPopup] = useState(false);
    const [idNguoiDaiDien, setIdNguoiDaiDien] = useState();
    const [tenNguoiDaiDien, setTenNguoiDaiDien] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [phanTramGiam, setPhanTramGiam] = useState(0);

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
            if(phanTramGiam < 0 || phanTramGiam > 100){
                setErrorMessage("Phần trăm giảm giá chưa hợp lệ")
            }
            const phieuThueRequest = {
                ngayDen: phieuDat.ngayBatDau,
                ngayDi: phieuDat.ngayTraPhong,
                idKhachHang: idNguoiDaiDien,
                idPhieuDat: phieuDat.idPhieuDat,
                phanTramGiam: phanTramGiam,
                chiTietRequests: []
            }
            
            try {
                const response = await axios.post(url + "/api/phieu-thue/", phieuThueRequest, { headers: { Authorization: `Bearer ${token}` } });
                if(response.data.code === 200){
                    navigate(`/phieu-thue`,{ state: { idPhieuDat: id, idPhieuThue: response.data.result.idPhieuThue ,
                        ngayNhanPhong: response.data.result.ngayDen,
                        ngayTraPhong: response.data.result.ngayDi
                    } })
                }else{
                    setErrorMessage(response.data.message)
                }
            } catch (error) {
                console.log(error.response.data.message);
                setErrorMessage(error.response.data.message)
            }
        }
    }

    const tinhTienGiamGia = ()=>{
        return phieuDat.tongTien * (phanTramGiam/100);
    }

    const tinhTienPhaiTra = ()=>{
        let tienPhaiTra = phieuDat.tongTien - phieuDat.tienTamUng - tinhTienGiamGia();
        return tienPhaiTra > 0 ? tienPhaiTra : 0;
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
                        setPhieuDat={setPhieuDat}
                        trangThai={phieuDat.trangThaiHuy}/>:<></>}
                    
                    {showDaiDienPopup ? <DaiDienPopup setShowDaiDienPopup={setShowDaiDienPopup} 
                    setIdNguoiDaiDien={setIdNguoiDaiDien}
                    setTenNguoiDaiDien={setTenNguoiDaiDien}/>: <></>}
                    
                    {showHuyPhongPopup ? <HuyPhongPopup 
                    setShowHuyPhongPopup={setShowHuyPhongPopup} 
                    idPhieuDat={phieuDat.idPhieuDat}
                    tienTamUng={phieuDat.tienTamUng}
                    setPhieuDat={setPhieuDat}/>: <></>}
                    <main className='phieu-dat'>
                        {phieuDat &&
                        <div className="table-data">
                            <div className="order">
                                <div className="head">
                                    <h3>Chi tiết phiếu đặt phòng - {phieuDat.idPhieuDat}</h3>
                                </div>
                                <div className='content'>
                                    <p>Thời gian: {convertDateShow(phieuDat.ngayBatDau)} đến {convertDateShow(phieuDat.ngayTraPhong)}</p>
                                    <p>Người đặt phòng: {phieuDat.hoTen}</p>
                                    <p>Tiền tạm ứng: {phieuDat.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Tổng giá trị: {phieuDat.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Trạng thái: {phieuDat.trangThaiHuy === 0 &&  "Chờ xử lý"}
                                                    {phieuDat.trangThaiHuy === 1 && "Hoàn thành"}
                                                    {phieuDat.trangThaiHuy === 2 && "Đã hủy"}
                                    </p>
                                    {phieuDat.trangThaiHuy === 2 && 
                                        <p>Tiền hoàn trả: {phieuDat.tienTra.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>}
                                    <p>Lưu ý của khách hàng: {phieuDat.ghiChu}</p>
                                    <p>Thời gian đặt: {convertDateShow(phieuDat.ngayTao)}</p>
                                    <div className='input-phan-tram-giam'>
                                        <label htmlFor="exampleFormControlInputPhanTramGiam" className="form-label">Giảm giá tiền phòng(%): </label>
                                        <input value={phanTramGiam} onChange={(e)=>setPhanTramGiam(e.target.value)} name='phanTramGiam' type="number" className="form-control" id="exampleFormControlInputPhanTramGiam" placeholder="%" />
                                    </div>
                                    <p>Tiền được giảm: {tinhTienGiamGia().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Tiền phải trả: {tinhTienPhaiTra().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Người đại diện: {tenNguoiDaiDien}</p>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="btn">
                                        
                                    </div>
                                    <button onClick={() => setShowDaiDienPopup(true)} className='btn btn-primary'>Chọn khách hàng đại diện</button>
                                    <button onClick={taoPhieuThue} className='btn btn-primary' >Xác nhận và chọn phòng</button>
                                    <button onClick={() => setShowHuyPhongPopup(true)} className='btn btn-danger' >Hủy đặt phòng</button>
                                   
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
                                            <li key={index} className="completed phieudat-details">
                                                <p>{item.tenHangPhong}</p>
                                                <p>x{item.soLuong}</p>
                                                <p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                <p>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
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