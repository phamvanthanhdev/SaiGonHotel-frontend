import React, { useContext, useState } from 'react'
import './DaiDienPopup.css'
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const DaiDienPopup = ({ setShowDaiDienPopup, setIdNguoiDaiDien, setTenNguoiDaiDien }) => {
    const {url, token} = useContext(StoreContext);
    const [khachHang, setKhachHang] = useState();
    const [cccd, setCccd] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const findUserByCmnd = async(event) => {
        event.preventDefault();
        
        const config = {
            params: {cccd: cccd},
            headers: { Authorization: `Bearer ${token}` }
        }

        await axios.get(url + "/api/khach-hang/tim-kiem-cccd", config)
        .then(response => {
            return response.data.result
        })
        .then(data => {
            setKhachHang(data)
            setErrorMessage("")
            setIdNguoiDaiDien(data.idKhachHang);
            setTenNguoiDaiDien(data.hoTen);
        })
        .catch(error => {
            setErrorMessage("Khách hàng không tồn tại")
        })
    }

  return (
        <div className='daidien-popup'>
            <form onSubmit={findUserByCmnd} action="" className="daidien-popup-container">
                <div className="daidien-popup-title">
                    <h4>Chọn khách hàng đại diện</h4>
                    <FontAwesomeIcon onClick={() => setShowDaiDienPopup(false)} className="close" icon={faXmark} />
                </div>

                <div  className="form-outline">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <label className="form-label" htmlFor="form2Example1">Căn cước công dân</label>
                    <input onChange={(e)=>setCccd(e.target.value)} name='cccd' type="text" id="form2Example1" className="form-control" required />
                </div>
                
                {khachHang &&
                <ul className="todo-list">
                    <li className="completed">
                        <p>{khachHang.hoTen}</p>
                        <p>{khachHang.sdt}</p>
                    </li>
                </ul>
                }
                <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                
            </form>
        </div>
  )
}

export default DaiDienPopup