import React, { useContext, useEffect, useState } from 'react'
import './ThemPhuThuPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemPhuThuPopup = ({ setShowThemPhuThuPopup, isCapNhat, setChiTietGiaPhuThus, setShowGiaPhuThus, setPhuThus, idPhuThu }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        noiDung: "",
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
                getPhuThuTheoId();
            }
        }
    }, [token])

    const themPhuThu = async () => {
        if (parseInt(data.giaCapNhat) <= 0) {
            setErrorMessage("Giá phụ thu phải lớn hơn 0");
        } else {
            try {
                const response = await axios.post(url + "/api/phu-thu/", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    refreshChiTietGiaPhuThus();
                    refreshPhuThus();
                    setErrorMessage("");
                    setShowThemPhuThuPopup(false);
                    toast.success("Thêm phụ thu thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const refreshChiTietGiaPhuThus = async () => {
        try {
            const response = await axios.get(url + "/api/phu-thu/chi-tiet-thay-doi-gia",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setChiTietGiaPhuThus(response.data.result);
                setShowGiaPhuThus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const refreshPhuThus = async () => {
        try {
            const response = await axios.get(url + "/api/phu-thu/thong-tin",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setPhuThus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapPhuThu = async () => {
        if (idPhuThu) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/phu-thu/"+idPhuThu, data, config);
                if (response.data.code === 200) {
                    refreshChiTietGiaPhuThus();
                    refreshPhuThus();
                    setErrorMessage("");
                    setShowThemPhuThuPopup(false);
                    toast.success("Cập nhật phụ thu thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const getPhuThuTheoId = async () => {
        if (idPhuThu) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/phu-thu/"+idPhuThu, config);
                if (response.data.code === 200) {
                    setData({
                        noiDung: response.data.result.noiDung,
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
            themPhuThu();
        } else {
            capNhapPhuThu();
        }
    }

    return (
        <div className='them-phu-thu-popup'>
            <form onSubmit={onSubmit} action="" className="them-phu-thu-popup-container">
                <div className="them-phu-thu-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} phụ thu</h2>
                    <FontAwesomeIcon onClick={() => setShowThemPhuThuPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="them-phu-thu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="noiDung">Tên phụ thu</label>
                    <input id='noiDung' onChange={onChangeHandler} value={data.noiDung} name='noiDung' type="text" placeholder='Nhập tên cập nhật' required />
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
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa chi tiết thay đổi giá này?')) { xoaChiTietThayDoiGiaPhuThu() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemPhuThuPopup