import React, { useContext, useEffect, useState } from 'react'
import './ThemKhuyenMaiPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemKhuyenMaiPopup = ({ setShowThemKhuyenMaiPopup, setCtkm, isCapNhat, idKhuyenMai }) => {
    const { url, token } = useContext(StoreContext);
    const dateFormat = new Date()
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        moTa: "",
        ngayBatDau: format(new Date(), "yyyy-MM-dd"),
        ngayKetThuc: format(new Date(), "yyyy-MM-dd")
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const themChuongTrinhKhuyenMai = async () => {
        try {
            const response = await axios.post(url + "/api/chuong-trinh-khuyen-mai/", data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            //refresh
            if (response.data.code === 200) {
                refreshCtkm();
                setErrorMessage("");
                setShowThemKhuyenMaiPopup(false);
                toast.success("Thêm chương trình khuyến mãi thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const refreshCtkm = async () => {
        try {
            const response = await axios.get(url + "/api/chuong-trinh-khuyen-mai/all",
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setCtkm(response.data.result);
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if(!isCapNhat)
            themChuongTrinhKhuyenMai();
        else
            capNhatChuongTrinhKhuyenMai();
    }

    const getKhuyenMaiTheoId = async () => {
        if (idKhuyenMai) {
            try {
                const response = await axios.get(url + "/api/chuong-trinh-khuyen-mai/" + idKhuyenMai,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    setData({
                        moTa: response.data.result.moTa,
                        ngayBatDau: response.data.result.ngayBatDau,
                        ngayKetThuc: response.data.result.ngayKetThuc
                    })
                    setErrorMessage("");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(er.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    useEffect(() => {
        if (token) {
            if(isCapNhat){
                getKhuyenMaiTheoId();
            }
        }
    }, [token])

    const capNhatChuongTrinhKhuyenMai = async () => {
        try {
            const response = await axios.put(url + "/api/chuong-trinh-khuyen-mai/"+idKhuyenMai, data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            //refresh
            if (response.data.code === 200) {
                refreshCtkm();
                setErrorMessage("");
                setShowThemKhuyenMaiPopup(false);
                toast.success("Cập nhật chương trình khuyến mãi thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const xoaChuongTrinhKhuyenMai = async () => {
        try {
            const response = await axios.delete(url + "/api/chuong-trinh-khuyen-mai/"+idKhuyenMai,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            //refresh
            if (response.data.code === 200) {
                refreshCtkm();
                setErrorMessage("");
                setShowThemKhuyenMaiPopup(false);
                toast.success("Xóa chương trình khuyến mãi thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    return (
        <>
        <div className='them-khuyen-mai-popup'>
            <form onSubmit={onSubmit} action="" className="them-khuyen-mai-popup-container">
                <div className="them-khuyen-mai-popup-title">
                    <h2>{isCapNhat?'Cập nhật':'Thêm'} khuyến mãi</h2>
                    <FontAwesomeIcon onClick={() => setShowThemKhuyenMaiPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="them-khuyen-mai-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <input onChange={onChangeHandler} value={data.moTa} name='moTa' type="text" placeholder='Tên chương trình khuyến mãi' required />
                    <input onChange={onChangeHandler} name='ngayBatDau' value={data.ngayBatDau} type="date" required />
                    <input onChange={onChangeHandler} name='ngayKetThuc' value={data.ngayKetThuc} type="date" required />
                </div>
                
                {!isCapNhat 
                ? 
                    <button type='submit'>Thêm mới</button>
                :
                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')){xoaChuongTrinhKhuyenMai()};}}  className='btnXoa' type='button'>Xóa</button>
                </div>
                }
                
            </form>
        </div>
        </>
    )
}

export default ThemKhuyenMaiPopup