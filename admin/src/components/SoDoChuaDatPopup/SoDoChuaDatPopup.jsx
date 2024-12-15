import React, { useContext, useEffect, useState } from 'react'
import './SoDoChuaDatPopup.css'
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from "date-fns";

const SoDoChuaDatPopup = ({setShowSodoPopup, ngayNhanPhong, ngayTraPhong, donGia, idHangPhong}) => {
    const { url, token } = useContext(StoreContext);
    const [phongs, setPhongs] = useState([]);

    const fetchPhong = async () => {
        const config = {
            params: {
                ngayDenThue: ngayNhanPhong,
                ngayDiThue: ngayTraPhong,
                idHangPhong: idHangPhong
            },
            headers: { Authorization: `Bearer ${token}` }
        }

        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hang-phong", config);
            setPhongs(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchPhong();
        console.log(donGia);
        
    }, [])

    return (
        <div className='sodo-chuadat-popup'>
            <form action="" className="sodo-chuadat-popup-container">
                <div className="sodo-chuadat-popup-title">
                    <h2>Xem phòng trống</h2>
                    <FontAwesomeIcon onClick={() => setShowSodoPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="rooms">
                    {phongs && phongs.map((item, index) => {
                        return (
                            <div key={index}
                                onClick={() => themPhong(item.tenHangPhong, item.maPhong, item.donGia)}
                                className={`room ${item.tenTrangThai !== "Sạch sẽ" ? "not-clear" : ""} ${item.daThue ? "not-avail" : ""}`}>
                                <p className='maPhong'>{item.maPhong}</p>
                                <p className='tang'>Tầng {item.tang}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="price">
                    <label htmlFor="priceInput" className='form-label'>Giá phòng</label>
                    <input id='priceInput' type="text" className='form-control'
                        name='donGia' value={donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} disabled/>
                </div>
            </form>
        </div>
    )
}

export default SoDoChuaDatPopup