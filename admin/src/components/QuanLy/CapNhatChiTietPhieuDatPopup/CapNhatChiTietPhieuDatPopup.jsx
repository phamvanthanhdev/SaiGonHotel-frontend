import React, { useContext, useEffect, useState } from 'react'
import './CapNhatChiTietPhieuDatPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const CapNhatChiTietPhieuDatPopup = ({ setShowCapNhatChiTietPhieuDatPopup, setPhieuDat, idChiTietPhieuDat, idPhieuDat, idHangPhong, soLuong, donGia }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        idChiTietPhieuDat: idChiTietPhieuDat,
        idPhieuDat: idPhieuDat,
        idHangPhong: idHangPhong,
        soLuong: soLuong,
        donGia: donGia
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const refreshPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/cap-nhat/${idPhieuDat}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setPhieuDat(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapChiTietPhieuDat = async () => {

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(url + "/api/phieu-dat/cap-nhat-chi-tiet", data, config);
            if (response.data.code === 200) {
                refreshPhieuDat();
                setErrorMessage("");
                setShowCapNhatChiTietPhieuDatPopup(false);
                toast.success("Cập nhật chi tiết phiếu đặt thành công");
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }

    }

    const xoaChiTietPhieuDat = async () => {
        try {
            const config = {
                params: {idPhieuDat, idHangPhong},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/phieu-dat/chi-tiet", config);

            if (response.data.code === 200) {
                refreshPhieuDat();
                setErrorMessage("");
                setShowCapNhatChiTietPhieuDatPopup(false);
                toast.success("Xóa chi tiết phiếu đặt thành công");
            }

        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    const onSubmit = async (event) => {
        event.preventDefault();

        capNhapChiTietPhieuDat();
    }

    return (
        <div className='cap-nhat-chi-tiet-phieu-dat-popup'>
            <form onSubmit={onSubmit} action="" className="cap-nhat-chi-tiet-phieu-dat-popup-container">
                <div className="cap-nhat-chi-tiet-phieu-dat-popup-title">
                    <h2>Chi tiết phiếu đặt</h2>
                    <FontAwesomeIcon onClick={() => setShowCapNhatChiTietPhieuDatPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="cap-nhat-chi-tiet-phieu-dat-popup-inputs">
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

export default CapNhatChiTietPhieuDatPopup