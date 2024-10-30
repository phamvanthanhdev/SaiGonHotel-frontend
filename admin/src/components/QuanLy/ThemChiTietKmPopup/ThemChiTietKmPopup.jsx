import React, { useContext, useEffect, useState } from 'react'
import './ThemChiTietKmPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemChiTietKmPopup = ({ setShowThemChiTietKmPopup, setChiTietKm, ctkm, isCapNhat, idKhuyenMai, idHangPhong }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [hangPhongs, setHangPhongs] = useState([]);

    const [data, setData] = useState({
        // idKhuyenMai: ctkm.length > 0 ? ctkm[0].idKhuyenMai : 0,
        idKhuyenMai: idKhuyenMai,
        idHangPhong: 0,
        phanTramGiam: 0
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
        }
    }, [token])

    const themChiTietKhuyenMai = async () => {
        if (parseInt(data.phanTramGiam) > 100 || parseInt(data.phanTramGiam) < 0) {
            setErrorMessage("Phần trăm giảm phải từ 0 đến 100");
        } else {
            try {
                const response = await axios.post(url + "/api/chi-tiet-khuyen-mai/", data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                //refresh
                if (response.data.code === 200) {
                    refreshChiTietKm();
                    setErrorMessage("");
                    setShowThemChiTietKmPopup(false);
                    toast.success("Thêm chi tiết khuyến mãi thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const capNhatChiTietKhuyenMai = async () => {
        if (idKhuyenMai && idHangPhong) {
        try {
            const config = {
                params: {idKhuyenMai, idHangPhong},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(url + "/api/chi-tiet-khuyen-mai/update-by-id", data, config);
            if (response.data.code === 200) {
                refreshChiTietKm();
                setErrorMessage("");
                setShowThemChiTietKmPopup(false);
                toast.success("Cập nhật chi tiết khuyến mãi thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }
    }

    const xoaChiTietKhuyenMai = async () => {
        try {
            const config = {
                params: {idKhuyenMai, idHangPhong},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + "/api/chi-tiet-khuyen-mai/del-by-id", config)
            //refresh
            if (response.data.code === 200) {
                refreshChiTietKm();
                setErrorMessage("");
                setShowThemChiTietKmPopup(false);
                toast.success("Xóa chi tiết khuyến mãi thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const getChiTietKmTheoId = async () => {
        if (idKhuyenMai && idHangPhong) {
            try {
                const config = {
                    params: {idKhuyenMai, idHangPhong},
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/chi-tiet-khuyen-mai/get-by-id", config);
                
                if (response.data.code === 200) {
                    setData({
                        idKhuyenMai: response.data.result.idKhuyenMai,
                        idHangPhong: response.data.result.idHangPhong,
                        phanTramGiam: response.data.result.phanTramGiam
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
                getChiTietKmTheoId();
            }
        }
    }, [token])

    const refreshChiTietKm = async () => {
        try {
            const response = await axios.get(url + "/api/chi-tiet-khuyen-mai/ctkm/" + idKhuyenMai, 
                {headers: { Authorization: `Bearer ${token}` }});
            if (response.data.code === 200) {
                setChiTietKm(response.data.result);
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
        if(!isCapNhat){
            themChiTietKhuyenMai();
        }else{
            capNhatChiTietKhuyenMai();
        }
        
    }

    return (
        <div className='chi-tiet-khuyen-mai-popup'>
            <form onSubmit={onSubmit} action="" className="chi-tiet-khuyen-mai-popup-container">
                <div className="chi-tiet-khuyen-mai-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} chi tiết</h2>
                    <FontAwesomeIcon onClick={() => setShowThemChiTietKmPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="chi-tiet-khuyen-mai-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <select onChange={onChangeHandler} name="idKhuyenMai" id="" value={data.idKhuyenMai} disabled={isCapNhat}>
                        {ctkm.map((item, index) => {
                            return (
                                <option key={index} value={item.idKhuyenMai}>{item.moTa}</option>
                            )
                        })}
                    </select>
                    <select onChange={onChangeHandler} name="idHangPhong" id="" value={isCapNhat ? idHangPhong : undefined} disabled={isCapNhat}>
                        {hangPhongs.map((item, index) => {
                            return (
                                <option key={index} value={item.id}>{item.tenHangPhong}</option>
                            )
                        })}
                        
                    </select>
                    <input onChange={onChangeHandler} value={data.phanTramGiam} name='phanTramGiam' type="number" placeholder='Phần trăm giảm' required />
                </div>
                {!isCapNhat 
                ? 
                    <button type='submit'>Thêm mới</button>
                :
                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa chi tiết khuyến mãi này?')){xoaChiTietKhuyenMai()};}}  className='btnXoa' type='button'>Xóa</button>
                </div>
                }
            </form>
        </div>
    )
}

export default ThemChiTietKmPopup