import React, { useContext, useEffect, useState } from 'react'
import './HangPhongPopup.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const HangPhongPopup = ({ setShowHangPhongPopup, ngayNhanPhong, ngayTraPhong, idPhieuDat, setPhieuDat, trangThai }) => {
    const navigate = useNavigate();
    const { url, token, setToken } = useContext(StoreContext);
    const [hangPhongTrong, setHangPhongTrong] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const config = {
        params: {
            ngayDenDat: ngayNhanPhong,
            ngayDiDat: ngayTraPhong
        },
        headers: { Authorization: `Bearer ${token}` }
    }

    const fetchHangPhongTrong = async () => {
        try {
            const response = await axios.get(url + "/api/thong-tin-hang-phong/thoi-gian-admin", config);
            setHangPhongTrong(response.data);
            for (let i = 0; i < response.data.length; i++) {
                setCartItems((prev) => ({ ...prev, [response.data[i].idHangPhong]: response.data[i].soLuongTrong }))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchHangPhongTrong();
        }
    }, [token])

    const [cartItems, setCartItems] = useState({});

    const addToCart = (e, itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: e.target.value }))
        console.log(cartItems);
    }

    const createDataRequest = () => {
        const data = hangPhongTrong.map(item => {
            if (cartItems[item.idHangPhong] > 0) {
                return {
                    idHangPhong: item.idHangPhong,
                    idPhieuDat: idPhieuDat,
                    donGia: item.giaKhuyenMai > 0 ? item.giaKhuyenMai : item.giaGoc,
                    soLuong: cartItems[item.idHangPhong]
                };
            }
        }).filter(item => item !== undefined);

        return data;
    };

    const refreshPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/details/${idPhieuDat}`, { headers: { Authorization: `Bearer ${token}` } });
            setPhieuDat(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const sendDataToServer = async () => {
        if (trangThai !== 0) {
            setErrorMessage("Phiếu đặt đã hoàn tất hoặc được hủy")
        } else {
            const dataRequest = createDataRequest();
            try {
                const response = await axios.post(url + "/api/phieu-dat/chi-tiet/bo-sung", dataRequest, { headers: { Authorization: `Bearer ${token}` } });
                if (response.data.code === 200) {
                    toast.success("Thêm thành công")
                    refreshPhieuDat();
                    setShowHangPhongPopup(false);
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }




    return (
        <div className='login-popup'>
            <form action="" className="login-popup-container">
                <div className="login-popup-title">
                    <h4>Thêm hạng phòng</h4>
                    <FontAwesomeIcon onClick={() => setShowHangPhongPopup(false)} className="close" icon={faXmark} />
                </div>
                {hangPhongTrong && <>
                    <ul className="todo-list">
                        {errorMessage && <p className='error'>{errorMessage}</p>}
                        {hangPhongTrong.map((item, index) => {

                            return (
                                <li key={index} className="completed">
                                    <p>{item.tenHangPhong}</p>
                                    <p>{item.giaKhuyenMai > 0
                                        ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                        : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    </p>
                                    <input onChange={(e) => addToCart(e, item.idHangPhong)} min={0} max={item.soLuongTrong} value={cartItems[item.idHangPhong]} type="number" className="form-control" placeholder='0' />
                                </li>
                            )
                        })}
                    </ul>
                    <button onClick={sendDataToServer} type="button" className="btn btn-primary">Xác nhận</button>
                </>
                }
            </form>
        </div>
    )
}

export default HangPhongPopup