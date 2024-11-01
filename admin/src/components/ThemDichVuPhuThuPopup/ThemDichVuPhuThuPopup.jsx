import React, { useContext, useState } from 'react'
import './ThemDichVuPhuThuPopup.css';
import { StoreContext } from '../../context/StoreContext';
import { faXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';

const ThemDichVuPhuThuPopup = ({ setShowDichVuPhuThuPopup, idDichVuPhuThu, tenDichVuPhuThu, donGia, type, 
                                idChiTiet, setChiTietDichVus, setChiTietPhuThus, setChiTietPhieuThue,
                            idPhieuThue, setChiTietPhieuThues, setPhieuThue }) => {
    const { url, token, setToken } = useContext(StoreContext);

    const [data, setData] = useState({
        soLuong: 1,
        donGia: donGia,
        daThanhToan: false
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if(type === "dichvu"){
            themChiTietSuDungDichVu();
        }else{
            themChiTietPhuThu();
        } 
    }

    const themChiTietSuDungDichVu = async () => {
		const dataDichVu = {
			"idDichVu": idDichVuPhuThu,
			"idChiTietPhieuThue": idChiTiet,
			"soLuong": data.soLuong,
			"donGia": data.donGia,
            "daThanhToan": data.daThanhToan ===  "true" ? true : false
		}

		try {
			const response = await axios.post(url + "/api/chi-tiet/dich-vu", dataDichVu,
				{ headers: { Authorization: `Bearer ${token}` } });

			toast.success("Thêm chi tiết dịch vụ thành công")
			setChiTietDichVus(response.data);
            //refresh data phiếu thuê
            fetchChiTietPhieuThueById(idChiTiet);
            setShowDichVuPhuThuPopup(false);
            refreshChiTietPhieuThues();
            refreshPhieuThue();
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

    const themChiTietPhuThu = async () => {
		const dataPhuThu = {
			"idPhuThu": idDichVuPhuThu,
			"idChiTietPhieuThue": idChiTiet,
			"soLuong": data.soLuong,
			"donGia": data.donGia,
            "daThanhToan": data.daThanhToan ===  "true" ? true : false
		}

		try {
			const response = await axios.post(url + "/api/chi-tiet/phu-thu", dataPhuThu,
				{ headers: { Authorization: `Bearer ${token}` } });

			toast.success("Thêm chi tiết phụ thu thành công")
			setChiTietPhuThus(response.data);
            //refresh data phiếu thuê
            fetchChiTietPhieuThueById(idChiTiet);
            setShowDichVuPhuThuPopup(false);
            refreshChiTietPhieuThues();
            refreshPhieuThue();
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

    const fetchChiTietPhieuThueById = async (idChiTiet) => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/${idChiTiet}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThue(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

    const refreshChiTietPhieuThues = async () => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThues(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

    const refreshPhieuThue = async () => {
		try {
			const response = await axios.get(url + `/api/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setPhieuThue(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

    return (
        <div className='dichvu-phuthu-popup'>
            <form onSubmit={onSubmit} action="" className="dichvu-phuthu-popup-container">
                <div className="dichvu-phuthu-popup-title">
                    <h2>{tenDichVuPhuThu}</h2>
                    <FontAwesomeIcon onClick={() => setShowDichVuPhuThuPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="dichvu-phuthu-popup-inputs">
                    <input onChange={onChangeHandler} value={data.soLuong} name='soLuong' type="number" placeholder='Số lượng' required />
                    <input onChange={onChangeHandler} name='donGia' value={data.donGia} type="number" placeholder='Đơn giá' required />
                    <select onChange={onChangeHandler} name="daThanhToan" id="">
                        <option value="false">Chưa thanh toán</option>
                        <option value="true">Đã thanh toán</option>
                    </select>
                </div>
                <button type='submit'>Xác nhận</button>
            </form>
        </div>
    )
}

export default ThemDichVuPhuThuPopup