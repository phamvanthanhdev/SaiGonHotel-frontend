import React, { useContext, useEffect, useState } from 'react'
import './ThemThayDoiGiaPhongPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";


const ThemThayDoiGiaPhongPopup = ({ setShowThemThayDoiGiaPhongPopup, isCapNhat, idHangPhong, idNhanVien, ngayCapNhat, setChiTietGiaPhongs }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [hangPhongs, setHangPhongs] = useState([]);

    const [data, setData] = useState({
        idHangPhong: 0,
        giaCapNhat: 0,
        ngayApDung: format(new Date(), "yyyy-MM-dd")
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const getHangPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/hang-phong/all",
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setHangPhongs(response.data);
            if (response.data.length > 0) {
                const hangPhong = response.data[0];
                setData(data => ({ ...data, idHangPhong: hangPhong.id }))
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHangPhongs();
            if (isCapNhat) {
                getThayDoiGiaPhongTheoId();
            }
        }
    }, [token])

    const themChiTietThayDoiGiaPhong = async () => {
        if (parseInt(data.giaCapNhat) <= 0) {
            setErrorMessage("Giá hạng phòng phải lớn hơn 0");
        } else {
            try {
                const response = await axios.post(url + "/api/chi-tiet-gia-phong/", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (response.data.code === 200) {
                    refreshChiTietGiaPhongs();
                    setErrorMessage("");
                    setShowThemThayDoiGiaPhongPopup(false);
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

    const refreshChiTietGiaPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/chi-tiet-gia-phong/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.code === 200) {
                setChiTietGiaPhongs(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const capNhapThayDoiGiaPhong = async () => {
        if (idHangPhong && idNhanVien && ngayCapNhat) {
            try {
                const config = {
                    params: { idNhanVien, idHangPhong, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/chi-tiet-gia-phong/update-by-id", data, config);
                if (response.data.code === 200) {
                    refreshChiTietGiaPhongs();
                    setErrorMessage("");
                    setShowThemThayDoiGiaPhongPopup(false);
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

    const xoaChiTietThayDoiGiaPhong = async () => {
        try {
            const config = {
                params: { idNhanVien, idHangPhong, ngayCapNhat },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/chi-tiet-gia-phong/del-by-id", config)
            if (response.data.code === 200) {
                refreshChiTietGiaPhongs();
                setErrorMessage("");
                setShowThemThayDoiGiaPhongPopup(false);
                toast.success("Xóa chi tiết thay đổi giá thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const getThayDoiGiaPhongTheoId = async () => {
        if (idNhanVien && idHangPhong && ngayCapNhat) {
            try {
                const config = {
                    params: { idNhanVien, idHangPhong, ngayCapNhat },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/chi-tiet-gia-phong/get-by-id", config);
                if (response.data.code === 200) {
                    setData({
                        idHangPhong: response.data.result.idHangPhong,
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
            themChiTietThayDoiGiaPhong();
        } else {
            capNhapThayDoiGiaPhong();
        }

    }

    return (
        <div className='thay-doi-gia-phong-popup'>
            <form onSubmit={onSubmit} action="" className="thay-doi-gia-phong-popup-container">
                <div className="thay-doi-gia-phong-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} giá phòng</h2>
                    <FontAwesomeIcon onClick={() => setShowThemThayDoiGiaPhongPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="thay-doi-gia-phong-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="hangPhong">Chọn hạng phòng</label>
                    <select onChange={onChangeHandler} name="idHangPhong" id="hangPhong" value={isCapNhat ? idHangPhong : undefined} disabled={isCapNhat}>
                        {hangPhongs.map((item, index) => {
                            return (
                                <option key={index} value={item.id}>{item.tenHangPhong}</option>
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
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa chi tiết giá phòng này?')) { xoaChiTietThayDoiGiaPhong() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemThayDoiGiaPhongPopup