import React, { useContext, useEffect, useState } from 'react'
import './CapNhatChiTietPhieuThuePopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const CapNhatChiTietPhieuThuePopup = ({ setShowCapNhatChiTietPhieuThuePopup, setPhieuThue, idPhieuThue, setChiTietPhieuThues, idChiTietPhieuThue, ngayNhanPhong, ngayTraPhong, tienGiamGia }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        idChiTietPhieuThue: idChiTietPhieuThue,
        ngayTraPhong: ngayTraPhong,
        tienGiamGia: tienGiamGia
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }


    const refreshPhieuThue = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-thue/cap-nhat/${idPhieuThue}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setPhieuThue(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const refreshChiTietPhieuThues = async () => {
        try {
            const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setChiTietPhieuThues(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapChiTietPhieuThue = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(url + "/api/chi-tiet/", data, config);
            if (response.data.code === 200) {
                refreshPhieuThue();
                refreshChiTietPhieuThues();
                setErrorMessage("");
                setShowCapNhatChiTietPhieuThuePopup(false);
                toast.success("Cập nhật chi tiết phiếu thuê thành công");
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }

    }

    const xoaChiTietPhieuThue = async () => {
        try {
            const config = {
                params: {idChiTietPhieuThue},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/phieu-thue/chi-tiet", config);

            if (response.data.code === 200) {
                refreshPhieuThue();
                refreshChiTietPhieuThues();
                setErrorMessage("");
                setShowCapNhatChiTietPhieuThuePopup(false);
                toast.success("Xóa chi tiết phiếu thuê thành công");
            }

        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    const onSubmit = async (event) => {
        event.preventDefault();

        capNhapChiTietPhieuThue();
    }

    return (
        <div className='cap-nhat-chi-tiet-phieu-thue-popup'>
            <form onSubmit={onSubmit} action="" className="cap-nhat-chi-tiet-phieu-thue-popup-container">
                <div className="cap-nhat-chi-tiet-phieu-thue-popup-title">
                    <h2>Chi tiết phiếu thuê</h2>
                    <FontAwesomeIcon onClick={() => setShowCapNhatChiTietPhieuThuePopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="cap-nhat-chi-tiet-phieu-thue-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="ngayNhanPhong">Ngày nhận phòng</label>
                    <input id='ngayNhanPhong' value={ngayNhanPhong} name='ngayNhanPhong' 
                        type="date" required disabled/>

                    <label htmlFor="ngayTraPhong">Ngày trả phòng</label>
                    <input id='ngayTraPhong' 
                        onChange={onChangeHandler} value={data.ngayTraPhong} name='ngayTraPhong' 
                        type="date" required/>

                    <label htmlFor="tienGiamGia">Giảm giá</label>
                    <input id='tienGiamGia' onChange={onChangeHandler} value={data.tienGiamGia} name='tienGiamGia' 
                        type="number" placeholder='Nhập tiền giảm giá' required />
                </div>
                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) { xoaChiTietPhieuThue() }; }} className='btnXoa' type='button'>Xóa</button>
                </div>
            </form>
        </div>
    )
}

export default CapNhatChiTietPhieuThuePopup