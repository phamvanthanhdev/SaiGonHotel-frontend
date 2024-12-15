import React, { useContext, useEffect, useState } from 'react'
import './CapNhatChiTietDVPTPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const CapNhatChiTietDVPTPopup = ({ setShowCapNhatChiTietDVPTPopup, idChiTietSuDungDichVu, idChiTietPhuThu, idChiTietPhieuThue, idDichVu, idPhuThu, noiDung, soLuong, setChiTietDichVus, setChiTietPhuThus, idPhieuThue }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        idChiTietSuDungDichVu: idChiTietSuDungDichVu,
        idChiTietPhuThu: idChiTietPhuThu,
        idChiTietPhieuThue: idChiTietPhieuThue,
        idDichVu: idDichVu,
        idPhuThu: idPhuThu,
        soLuong: soLuong
    })

    console.log(idChiTietPhuThu);
    

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

                if(idDichVu){
                    refreshChiTietDichVus();
                }else if(idPhuThu){
                    refreshChiTietPhuThus();
                }
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }

    }

    const xoaChiTietDichVuPhuThu = async () => {
        try {
            let config = {};
            let newUrl = "";
            if(idDichVu){
                config = {
                    params: {idChiTietSuDungDichVu},
                    headers: { Authorization: `Bearer ${token}` }
                }
                newUrl = url + "/api/chi-tiet/dich-vu";
            }
            if(idPhuThu){
                config = {
                    params: {idChiTietPhuThu},
                    headers: { Authorization: `Bearer ${token}` }
                } 
                newUrl = url + "/api/chi-tiet/phu-thu";
            }
            const response = await axios.delete(newUrl, config);

            if (response.data.code === 200) {
                if(idDichVu){
                    refreshChiTietDichVus();
                }else if(idPhuThu){
                    refreshChiTietPhuThus();
                }
                setErrorMessage("");
                setShowCapNhatChiTietDVPTPopup(false);
                toast.success("Xóa chi tiết thành công");
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

    const refreshChiTietDichVus = async () => {
        try {
            const config = {
                params: { idPhieuThue },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + `/api/dich-vu/chi-tiet/phieu-thue`, config);
            if (response.data.code === 200)
                setChiTietDichVus(response.data.result);
            else
                toast.error(response.data.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const refreshChiTietPhuThus = async () => {
        try {
            const config = {
                params: { idPhieuThue },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + `/api/phu-thu/chi-tiet/phieu-thue`, config);
            if (response.data.code === 200)
                setChiTietPhuThus(response.data.result);
            else
                toast.error(response.data.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <div className='cap-nhat-chi-tiet-dichvu-phuthu-popup'>
            <form onSubmit={onSubmit} action="" className="cap-nhat-chi-tiet-dichvu-phuthu-popup-container">
                <div className="cap-nhat-chi-tiet-dichvu-phuthu-popup-title">
                    <h2>Chi tiết {idDichVu ? 'sử dụng dịch vụ' : 'phụ thu'}</h2>
                    <FontAwesomeIcon onClick={() => setShowCapNhatChiTietDVPTPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="cap-nhat-chi-tiet-dichvu-phuthu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="noiDung">{idDichVu ? 'Tên dịch vụ' : 'Tên phụ thu'}</label>
                    <input id='noiDung' value={noiDung} name='noiDung' type="text" placeholder='Nhập đơn giá' required disabled/>

                    <label htmlFor="soLuong">Số lượng</label>
                    <input id='soLuong' onChange={onChangeHandler} value={data.soLuong} name='soLuong' type="text" placeholder='Nhập số lượng' required />
                </div>
                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa không?')) { xoaChiTietDichVuPhuThu() }; }} className='btnXoa' type='button'>Xóa</button>
                </div>
            </form>
        </div>
    )
}

export default CapNhatChiTietDVPTPopup