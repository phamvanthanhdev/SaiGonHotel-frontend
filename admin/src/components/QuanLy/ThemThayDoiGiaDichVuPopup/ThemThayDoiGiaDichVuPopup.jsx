import React, { useContext, useEffect, useState } from 'react'
import './ThemThayDoiGiaDichVuPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemThayDoiGiaDichVuPopup = ({ setShowThemThayDoiGiaDichVuPopup, isCapNhat, setChiTietGiaDichVus, setShowGiaDichVus, idDichVu, idNhanVien, ngayCapNhat, setDataDichVus }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [dichVus, setDichVus] = useState([]);

    const [data, setData] = useState({
        idDichVu: 0,
        giaCapNhat: 0,
        ngayApDung: format(new Date(), "yyyy-MM-dd")
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const getDichVus = async () => {
        try {
            const response = await axios.get(url + "/api/dich-vu/all",
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setDichVus(response.data);
            if (response.data.length > 0) {
                setData(data => ({ ...data, idDichVu: response.data[0].idDichVu }))
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getDichVus();
            if (isCapNhat) {
                getThayDoiGiaDichVuTheoId();
            }
        }
    }, [token])

    const themChiTietThayDoiGiaDichVu = async () => {
        if (parseInt(data.giaCapNhat) <= 0) {
            setErrorMessage("Giá dịch vụ phải lớn hơn 0");
        } else {
            try {
                const response = await axios.post(url + "/api/dich-vu/thay-doi-gia", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    refreshChiTietGiaDichVus();
                    refreshDichVus();
                    setErrorMessage("");
                    setShowThemThayDoiGiaDichVuPopup(false);
                    toast.success("Thêm chi tiết thay đổi giá thành công");
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
                setDataDichVus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapThayDoiGiaDichVu = async () => {
        if (idDichVu && idNhanVien && ngayCapNhat) {
            try {
                const config = {
                    params: { idDichVu, idNhanVien, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/dich-vu/thay-doi-gia", data, config);
                if (response.data.code === 200) {
                    refreshChiTietGiaDichVus();
                    refreshDichVus();
                    setErrorMessage("");
                    setShowThemThayDoiGiaDichVuPopup(false);
                    toast.success("Cập nhật chi tiết thay đổi giá thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const xoaChiTietThayDoiGiaDichVu = async () => {
        try {
            const config = {
                params: { idDichVu, idNhanVien, ngayCapNhat },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/dich-vu/thay-doi-gia", config)
            if (response.data.code === 200) {
                refreshChiTietGiaDichVus();
                refreshDichVus();
                setErrorMessage("");
                setShowThemThayDoiGiaDichVuPopup(false);
                toast.success("Xóa chi tiết thay đổi giá thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const getThayDoiGiaDichVuTheoId = async () => {
        if (idNhanVien && idDichVu && ngayCapNhat) {
            try {
                const config = {
                    params: { idDichVu, idNhanVien, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/dich-vu/thay-doi-gia-theo-id", config);
                if (response.data.code === 200) {
                    setData({
                        idDichVu: response.data.result.idDichVu,
                        giaCapNhat: response.data.result.giaCapNhat,
                        ngayApDung: response.data.result.ngayApDung
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
            themChiTietThayDoiGiaDichVu();
        } else {
            capNhapThayDoiGiaDichVu();
        }

    }

    return (
        <div className='thay-doi-gia-dich-vu-popup'>
            <form onSubmit={onSubmit} action="" className="thay-doi-gia-dich-vu-popup-container">
                <div className="thay-doi-gia-dich-vu-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} giá dịch vụ</h2>
                    <FontAwesomeIcon onClick={() => setShowThemThayDoiGiaDichVuPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="thay-doi-gia-dich-vu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="idDichVu">Chọn dịch vụ</label>
                    <select onChange={onChangeHandler} name="idDichVu" id="idDichVu" value={data.idDichVu} disabled={isCapNhat}>
                        {dichVus.map((item, index) => {
                            return (
                                <option key={index} value={item.idDichVu}>{item.tenDichVu}</option>
                            )
                        })}
                    </select>

                    <label htmlFor="ngayApDung">Ngày áp dụng</label>
                    <input onChange={onChangeHandler} name='ngayApDung' id="ngayApDung"
                        value={data.ngayApDung}
                        className="form-control" type="date" />

                    <label htmlFor="giaCapNhat">Giá cập nhật</label>
                    <input id='giaCapNhat' onChange={onChangeHandler} value={data.giaCapNhat} name='giaCapNhat' type="number" placeholder='Giá cập nhật' required />
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

export default ThemThayDoiGiaDichVuPopup