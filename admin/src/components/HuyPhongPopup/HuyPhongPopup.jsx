import React, { useContext, useState } from 'react'
import './HuyPhongPopup.css'
import { StoreContext } from '../../context/StoreContext';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { toast } from 'react-toastify';

const HuyPhongPopup = ({ setShowHuyPhongPopup, idPhieuDat, tienTamUng, setPhieuDat, setCapNhatPhieuDat, setDataCapNhat, type }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState({
        idPhieuDat: idPhieuDat,
        tienTra: tienTamUng
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const huyDatPhong = async () => {
        if (data.tienTra > tienTamUng) {
            setErrorMessage("Tiền hoàn trả không thể lớn hơn tiền tạm ứng");
        } else {
            try {
                const response = await axios.put(url + "/api/phieu-dat/huy-dat", data,
                    { headers: { Authorization: `Bearer ${token}` } });
                if (response.data.code === 200) {
                    toast.success("Hủy phiếu đặt phòng thành công");
                    if(type === 0)
                        refreshPhieuDat();
                    if(type === 1)
                        refreshCapNhatPhieuDat();
                    setShowHuyPhongPopup(false);
                    setErrorMessage("");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error.data);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const refreshPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/details/${idPhieuDat}`, { headers: { Authorization: `Bearer ${token}` } });
            setPhieuDat(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const refreshCapNhatPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/cap-nhat/${idPhieuDat}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setCapNhatPhieuDat(response.data);
            setDataCapNhat({
                idPhieuDat: response.data.idPhieuDat,
                ngayNhanPhong: response.data.ngayBatDau,
                ngayTraPhong: response.data.ngayTraPhong,
                tienTra: response.data.trangThaiHuy === 2 ? response.data.tienTra : null,
                trangThaiHuy: response.data.trangThaiHuy
            })
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        huyDatPhong();
    }
    return (
        <div className='huy-phong-popup'>
            <form onSubmit={onSubmit} action="" className="huy-phong-popup-container">
                <div className="huy-phong-popup-title">
                    <h2>Xác nhận hủy phiếu đặt</h2>
                    <FontAwesomeIcon onClick={() => setShowHuyPhongPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="huy-phong-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <label htmlFor="idTienTra">Tiền hoàn trả</label>
                    <input id='idTienTra' onChange={onChangeHandler} value={data.tienTra} name='tienTra' type="number" placeholder='Tiền trả' required />
                </div>
                <button type='submit'>Xác nhận</button>
            </form>
        </div>
    )
}

export default HuyPhongPopup