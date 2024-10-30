import React, { useContext, useEffect, useState } from 'react'
import './ThemKhachThuePopup.css'
import { StoreContext } from '../../context/StoreContext';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';

const ThemKhachThuePopup = ({ setShowThemKhachThuePopup, phongs, khachThues, setKhachThues, setKhachThueShows }) => {
    const { url, token } = useContext(StoreContext);
    const [idChiTietPhieuThue, setIdChiTietPhieuThue] = useState(phongs.length > 0 ? phongs[0].idChiTietPhieuThue : '');
    const [soNguoiToiDa, setSoNguoiToiDa] = useState(phongs.length > 0 ? phongs[0].soNguoiToiDa : '');
    const [maPhong, setMaPhong] = useState(phongs.length > 0 ? phongs[0].maPhong : '');
    const [cccd, setCccd] = useState();
    const [thongTinKhachHang, setThongTinKhachHang] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [idKhachHang, setIdKhachHang] = useState();
    const [soLuongKhachThue, setSoLuongKhachThue] = useState();

    useEffect(()=>{
        setSoLuongKhachThue(khachThues.filter((khach) => khach.maPhong === maPhong).length);
        console.log(khachThues.filter((khach) => khach.maPhong === maPhong).length);
        
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        if(soLuongKhachThue >= soNguoiToiDa){
            if(window.confirm('Nếu thêm khách hàng này sẽ vượt quá số lượng cho phép của phòng. Bạn có chắc chắn muốn thêm ?')){
                themKhachThue();
            }
        }else{
            themKhachThue();
        }
    }

    const themKhachThue = async()=>{
        const data = {
            idChiTietPhieuThue: idChiTietPhieuThue,
            idKhachThues: [idKhachHang]
        }

        try {
            const response = await axios.post(url + "/api/chi-tiet/add-khach-thue", data,
                { headers: { Authorization: `Bearer ${token}` }}
            );

            if(response.data.code === 200){
                toast.success("Thêm khách lưu trú thành công");
                setShowThemKhachThuePopup(false);
                //refresh
                refreshKhachThueHienTai();
                setErrorMessage("");
            }else{
                errorMessage(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            // toast.error(error.message);
            setErrorMessage(error.response.data.message);
        }
        
    }

    const refreshKhachThueHienTai = async()=>{
        try {
            const response = await axios.get(url + "/api/chi-tiet/khach-thue/hien-tai", { headers: { Authorization: `Bearer ${token}` } });
            setKhachThues(response.data);
            setKhachThueShows(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const onChangeCccd = async (e) => {
        const value = e.target.value;
        setCccd(value);
        if (value.length === 12) {
            try {
                const config = {
                    params: { cccd: value },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/khach-hang/tim-kiem-cccd", config);
                if (response.data.code === 200) {
                    setIdKhachHang(response.data.result.idKhachHang);
                    setErrorMessage("");
                    setThongTinKhachHang(response.data.result.hoTen + " - " + response.data.result.sdt);
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
                // toast.error(error.response.data.message);
            }
        } else {
            setErrorMessage("CCCD phải có 12 kí tự");
        }
    }

    const onChangePhong = (e)=>{
        const value = e.target.value;
        const phong = phongs.find((phong)=>phong.maPhong === value);
        setIdChiTietPhieuThue(phong.idChiTietPhieuThue);

        setSoLuongKhachThue(khachThues.filter((khach) => khach.maPhong === value).length);
    }

    return (
        <div className='trang-thai-phong-popup'>
            <form onSubmit={onSubmit} action="" className="trang-thai-phong-popup-container">
                <div className="trang-thai-phong-popup-title">
                    <h2>Thêm khách lưu trú</h2>
                    <FontAwesomeIcon onClick={() => setShowThemKhachThuePopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="trang-thai-phong-popup-inputs">
                {errorMessage && <p className='error'>{errorMessage}</p>}
                    <label htmlFor="maPhong">Chọn phòng </label>
                    <select onChange={(e)=>onChangePhong(e)} name="maPhong" id="maPhong">
                        {phongs.map((item, index) => {
                            return (
                                <option key={index} value={item.maPhong}>Phòng {item.maPhong}</option>
                            )
                        })}

                    </select>

                    <label for="exampleInputEmail1" >CCCD khách hàng</label>
                    <input type="number" name='cccd' value={cccd} onChange={onChangeCccd} id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">{thongTinKhachHang ? `Khách hàng: ${thongTinKhachHang}` : 'Chưa có khách hàng nào được chọn'}</div>
                </div>
                <button type='submit'>Xác nhận</button>
            </form>
        </div>
    )
}

export default ThemKhachThuePopup