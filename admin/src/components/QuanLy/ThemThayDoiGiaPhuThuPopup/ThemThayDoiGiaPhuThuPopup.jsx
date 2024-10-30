import React, { useContext, useEffect, useState } from 'react'
import './ThemThayDoiGiaPhuThuPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemThayDoiGiaPhuThuPopup = ({ setShowThemThayDoiGiaPhuThuPopup, isCapNhat, setChiTietGiaPhuThus, setShowGiaPhuThus, idPhuThu, idNhanVien, ngayCapNhat, setDataPhuThus }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [phuThus, setPhuThus] = useState([]);

    const [data, setData] = useState({
        idPhuThu: 0,
        giaCapNhat: 0,
        ngayApDung: format(new Date(), "yyyy-MM-dd")
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const getPhuThus = async () => {
        try {
            const response = await axios.get(url + "/api/phu-thu/all",
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPhuThus(response.data);
            if (response.data.length > 0) {
                setData(data => ({ ...data, idPhuThu: response.data[0].idPhuThu }))
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getPhuThus();
            if (isCapNhat) {
                getThayDoiGiaPhuThuTheoId();
            }
        }
    }, [token])

    const themChiTietThayDoiGiaPhuThu = async () => {
        if (parseInt(data.giaCapNhat) <= 0) {
            setErrorMessage("Giá phụ thu phải lớn hơn 0");
        } else {
            try {
                const response = await axios.post(url + "/api/phu-thu/thay-doi-gia", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    refreshChiTietGiaPhuThus();
                    refreshPhuThus();
                    setErrorMessage("");
                    setShowThemThayDoiGiaPhuThuPopup(false);
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
                setDataPhuThus(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapThayDoiGiaPhuThu = async () => {
        if (idPhuThu && idNhanVien && ngayCapNhat) {
            try {
                const config = {
                    params: { idPhuThu, idNhanVien, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/phu-thu/thay-doi-gia", data, config);
                if (response.data.code === 200) {
                    refreshChiTietGiaPhuThus();
                    refreshPhuThus();
                    setErrorMessage("");
                    setShowThemThayDoiGiaPhuThuPopup(false);
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

    const xoaChiTietThayDoiGiaPhuThu = async () => {
        try {
            const config = {
                params: { idPhuThu, idNhanVien, ngayCapNhat },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/phu-thu/thay-doi-gia", config)
            if (response.data.code === 200) {
                refreshChiTietGiaPhuThus();
                refreshPhuThus();
                setErrorMessage("");
                setShowThemThayDoiGiaPhuThuPopup(false);
                toast.success("Xóa chi tiết thay đổi giá thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const getThayDoiGiaPhuThuTheoId = async () => {
        if (idNhanVien && idPhuThu && ngayCapNhat) {
            try {
                const config = {
                    params: { idPhuThu, idNhanVien, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/phu-thu/thay-doi-gia-theo-id", config);
                if (response.data.code === 200) {
                    setData({
                        idPhuThu: response.data.result.idPhuThu,
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
            themChiTietThayDoiGiaPhuThu();
        } else {
            capNhapThayDoiGiaPhuThu();
        }

    }

    return (
        <div className='thay-doi-gia-phu-thu-popup'>
            <form onSubmit={onSubmit} action="" className="thay-doi-gia-phu-thu-popup-container">
                <div className="thay-doi-gia-phu-thu-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} giá phụ thu</h2>
                    <FontAwesomeIcon onClick={() => setShowThemThayDoiGiaPhuThuPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="thay-doi-gia-phu-thu-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="idPhuThu">Chọn phụ thu</label>
                    <select onChange={onChangeHandler} name="idPhuThu" id="idPhuThu" value={data.idPhuThu} disabled={isCapNhat}>
                        {phuThus.map((item, index) => {
                            return (
                                <option key={index} value={item.idPhuThu}>{item.noiDung}</option>
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
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa chi tiết thay đổi giá này?')) { xoaChiTietThayDoiGiaPhuThu() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemThayDoiGiaPhuThuPopup