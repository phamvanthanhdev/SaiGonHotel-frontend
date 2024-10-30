import React from 'react'
import './ThueThemPopup.css';
import { useState } from 'react';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from '../../context/StoreContext';
import { useContext } from 'react';
import { format } from "date-fns";
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SoDoPopup from '../SoDoPopup/SoDoPopup';

const ThueThemPopup = ({ setShowThueThemPopup, ngayDi, idPhieuThue, setChiTietPhieuThues}) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [ngayNhanPhong, setNgayNhanPhong] = useState(format(new Date(), "yyyy-MM-dd"));
    const [ngayTraPhong, setNgayTraPhong] = useState(ngayDi);
    const [hangPhongs, setHangPhongs] = useState([]);
    const [showSodoPopup, setShowSodoPopup] = useState(false);
    const [idHangPhong, setIdHangPhong] = useState();
    const [donGia, setDonGia] = useState();

    const getHangPhong = async (ngayNhanPhong, ngayTraPhong) => {
        try {
            const config = {
                params: { ngayDenDat: ngayNhanPhong, ngayDiDat: ngayTraPhong },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/thong-tin-hang-phong/thoi-gian", config);
            setHangPhongs(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHangPhong(ngayNhanPhong, ngayTraPhong);
        }
    }, [token])

    const onChangeNgayTraPhong = (e) => {
        setNgayTraPhong(e.target.value)
        getHangPhong(ngayNhanPhong, e.target.value);
    }

    const onClickChonPhong = (idHangPhong, donGia)=>{
        setIdHangPhong(idHangPhong);
        setDonGia(donGia);
        setShowSodoPopup(true);
        
    }

    return (
        <>
        {showSodoPopup ? <SoDoPopup setShowSodoPopup={setShowSodoPopup}
						idPhieuThue={idPhieuThue}
						ngayBatDau={ngayNhanPhong}
						ngayTraPhong={ngayTraPhong}
						donGia={donGia}
						idHangPhong={idHangPhong}
						setChiTietPhieuThues={setChiTietPhieuThues}
						daDatTruoc={false}
						setHangPhongs={setHangPhongs}
					/> : <></>}
        <div className={`thuethem-popup ${showSodoPopup ? 'hide-hangphong' : ''}`}>
            <div className="thuethem-popup-container">
                <div className="thuethem-popup-title">
                    <h2>Danh sách hạng phòng trống</h2>
                    <FontAwesomeIcon onClick={() => setShowThueThemPopup(false)} className="close" icon={faXmark} />
                </div>
                <form>
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày nhận phòng</label>
                        <input name='ngay' value={ngayNhanPhong}
                            type="date" className="form-control" id="exampleFormControlInput1" disabled />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày trả phòng</label>
                        <input name='ngay' value={ngayTraPhong} onChange={onChangeNgayTraPhong}
                            type="date" className="form-control" id="exampleFormControlInput1" />
                    </div>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Tên hạng phòng</th>
                            <th>Còn trống</th>
                            <th>Kiểu phòng</th>
                            <th>Loại phòng</th>
                            <th>Sức chứa</th>
                            <th>Giá phòng</th>
                            <th>Chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            hangPhongs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td>{item.tenHangPhong}</td>
                                        <td>{item.soLuongTrong} phòng</td>
                                        <td>{item.tenKieuPhong}</td>
                                        <td>{item.tenLoaiPhong}</td>
                                        <td>{item.soNguoiToiDa} người</td>
                                        {item.phanTramGiam > 0
                                            ? <td>
                                                {item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                            </td>
                                            : <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        }
                                        <td><button onClick={() => onClickChonPhong(item.idHangPhong, item.phanTramGiam > 0 ? item.giaKhuyenMai : item.giaGoc)}
                                            className='btn btn-primary' disabled={item.soLuongTrong <= 0}>Chọn</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default ThueThemPopup