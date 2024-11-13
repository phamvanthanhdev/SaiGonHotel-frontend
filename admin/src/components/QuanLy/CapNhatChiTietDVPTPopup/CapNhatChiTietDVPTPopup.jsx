import React, { useContext, useEffect, useState } from 'react'
import './CapNhatChiTietDVPTPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const CapNhatChiTietDVPTPopup = ({ setShowCapNhatChiTietDVPTPopup, idChiTietPhieuThue, idDichVu, idPhuThu, noiDung, soLuong, setChiTietDichVus, setChiTietPhuThus }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [dataDichVu, setDataDichVu] = useState({
        idChiTietPhieuThue: idChiTietPhieuThue,
        idDichVu: idDichVu,
        idPhuThu: idPhuThu,
        soLuong: soLuong
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const capNhapChiTietDichVuPhuThu = async () => {
        let newUrl;
        if(idDichVu){
            newUrl = url + "/api/chi-tiet/dich-vu";
        }else if(idPhuThu){
            newUrl = url + "/api/chi-tiet/phu-thu";
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(newUrl, data, config);
            if (response.data.code === 200) {
                setErrorMessage("");
                setShowCapNhatChiTietDVPTPopup(false);
                toast.success("Cập nhật chi tiết thành công");
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }

    }

    const xoaChiTietDichVuPhuThu = async () => {
        try {
            const config = {
                params: {idDichVu, idChiTietPhieuThue},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/dichvu-phuthu/chi-tiet", config);

            if (response.data.code === 200) {
                
                setErrorMessage("");
                setShowCapNhatChiTietDVPTPopup(false);
                toast.success("Xóa chi tiết phiếu đặt thành công");
            }

        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    const onSubmit = async (event) => {
        event.preventDefault();

        capNhapChiTietDichVuPhuThu();
    }

    return (
        <div className='cap-nhat-chi-tiet-dichvu-phuthu-popup'>
            <form onSubmit={onSubmit} action="" className="cap-nhat-chi-tiet-dichvu-phuthu-popup-container">
                <div className="cap-nhat-chi-tiet-dichvu-phuthu-popup-title">
                    <h2>Chi tiết phiếu đặt</h2>
                    <FontAwesomeIcon onClick={() => setShowCapNhatChiTietDVPTPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="cap-nhat-chi-tiet-dichvu-phuthu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="donGia">Đơn giá</label>
                    <input id='donGia' onChange={onChangeHandler} value={data.donGia} name='donGia' type="text" placeholder='Nhập đơn giá' required disabled/>

                    <label htmlFor="soLuong">Số lượng</label>
                    <input id='soLuong' onChange={onChangeHandler} value={data.soLuong} name='soLuong' type="text" placeholder='Nhập số lượng' required />
                </div>
                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) { xoaChiTietPhieuDat() }; }} className='btnXoa' type='button'>Xóa</button>
                </div>
            </form>
        </div>
    )
}

export default CapNhatChiTietDVPTPopup