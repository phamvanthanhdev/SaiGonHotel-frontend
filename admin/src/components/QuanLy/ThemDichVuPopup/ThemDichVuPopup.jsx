import React, { useContext, useEffect, useState } from 'react'
import './ThemDichVuPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemDichVuPopup = ({ setShowThemDichVuPopup, isCapNhat, setChiTietGiaDichVus, setShowGiaDichVus, setDichVus, idDichVu }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        tenDichVu: "",
        donGia: 0
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (token) {
            if (isCapNhat) {
                getDichVuTheoId();
            }
        }
    }, [token])

    const themDichVu = async () => {
        if (parseInt(data.giaCapNhat) <= 0) {
            setErrorMessage("Giá dịch vụ phải lớn hơn 0");
        } else {
            try {
                const response = await axios.post(url + "/api/dich-vu/", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    refreshChiTietGiaDichVus();
                    refreshDichVus();
                    setErrorMessage("");
                    setShowThemDichVuPopup(false);
                    toast.success("Thêm dịch vụ thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const refreshChiTietGiaDichVus = async () => {
        try {
            const response = await axios.get(url + "/api/dich-vu/chi-tiet-thay-doi-gia",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setChiTietGiaDichVus(response.data.result);
                setShowGiaDichVus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const refreshDichVus = async () => {
        try {
            const response = await axios.get(url + "/api/dich-vu/thong-tin",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setDichVus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapDichVu = async () => {
        if (idDichVu) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/dich-vu/"+idDichVu, data, config);
                if (response.data.code === 200) {
                    refreshChiTietGiaDichVus();
                    refreshDichVus();
                    setErrorMessage("");
                    setShowThemDichVuPopup(false);
                    toast.success("Cập nhật dịch vụ thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    // const xoaChiTietThayDoiGiaDichVu = async () => {
    //     try {
    //         const config = {
    //             params: { idDichVu, idNhanVien, ngayCapNhat },
    //             headers: { Authorization: `Bearer ${token}` }
    //         }
    //         const response = await axios.delete(url + "/api/dich-vu/thay-doi-gia", config)
    //         if (response.data.code === 200) {
    //             refreshChiTietGiaDichVus();
    //             refreshDichVus();
    //             setErrorMessage("");
    //             setShowThemThayDoiGiaDichVuPopup(false);
    //             toast.success("Xóa chi tiết thay đổi giá thành công");
    //         } else {
    //             setErrorMessage(response.data.message);
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //         setErrorMessage(error.response.data.message);
    //     }
    // }

    const getDichVuTheoId = async () => {
        if (idDichVu) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/dich-vu/"+idDichVu, config);
                if (response.data.code === 200) {
                    setData({
                        tenDichVu: response.data.result.tenDichVu,
                        donGia: response.data.result.donGia
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

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!isCapNhat) {
            themDichVu();
        } else {
            capNhapDichVu();
        }
    }

    return (
        <div className='them-dich-vu-popup'>
            <form onSubmit={onSubmit} action="" className="them-dich-vu-popup-container">
                <div className="them-dich-vu-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} dịch vụ</h2>
                    <FontAwesomeIcon onClick={() => setShowThemDichVuPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="them-dich-vu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="tenDichVu">Tên dịch vụ</label>
                    <input id='tenDichVu' onChange={onChangeHandler} value={data.tenDichVu} name='tenDichVu' type="text" placeholder='Nhập tên cập nhật' required />
                    {!isCapNhat && 
                    <>
                        <label htmlFor="donGia">Đơn giá</label>
                        <input id='donGia' onChange={onChangeHandler} value={data.donGia} name='donGia' type="number" placeholder='Nhập đơn giá' required disabled={isCapNhat}/>
                    </>
                    }
                </div>
                {!isCapNhat
                    ?
                    <button type='submit'>Thêm mới</button>
                    :
                    <div className="capNhat">
                        <button type='submit'>Cập nhật</button>
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa chi tiết thay đổi giá này?')) { xoaChiTietThayDoiGiaDichVu() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemDichVuPopup