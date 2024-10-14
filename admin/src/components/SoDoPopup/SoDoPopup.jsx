import React, { useContext, useEffect, useState } from 'react'
import './SoDoPopup.css'
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SoDoPopup = ({ setShowSodoPopup, idPhieuThue, ngayBatDau, ngayTraPhong, donGia, idHangPhong, setChiTietPhieuThues }) => {
    const {url, token} = useContext(StoreContext);
    const [phong, setPhong] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [donGiaMoi, setDonGiaMoi] = useState(donGia);

    const fetchPhong = async() => {
        const config = {
            params: { 
                ngayDenThue: ngayBatDau ,
                ngayDiThue: ngayTraPhong,
                idHangPhong: idHangPhong
            },
            headers: { Authorization: `Bearer ${token}` }
        }

        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hang-phong", config);
            setPhong(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchPhong();
    }, [])

    const themChiTietPhieuThue = async(maPhong) => {
        const formData = {
            "maPhong": maPhong,
            "idPhieuThue": idPhieuThue,
            "ngayDen": ngayBatDau,
            "ngayDi": ngayTraPhong,
            "donGia": donGiaMoi
        }

        try {
            const response = await axios.post(url + "/api/chi-tiet/them", formData, { headers: { Authorization: `Bearer ${token}` } });
            if(response.data.code === 200){
                // Refresh data chi tiết phiếu thuê
                refreshChiTietPhieuThue();

                setShowSodoPopup(false);
                setErrorMessage("");
                toast.success("Tạo chi tiết phiếu thuê thành công")
            }else{
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const refreshChiTietPhieuThue = async () => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThues(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

  return (
    <div className='login-popup'>
    <form action="" className="login-popup-container">
        <div className="login-popup-title">
            <h2>Chọn phòng</h2>
            <FontAwesomeIcon onClick={() => setShowSodoPopup(false)} className="close" icon={faXmark} />
        </div>
        {errorMessage && 
            <div className='message'>
                <p className='error'>{errorMessage}</p>
            </div>
        }
        <div className="rooms">
            {phong && phong.map((item, index) => {
                return(
                    <div key={index} 
                        onClick={()=>themChiTietPhieuThue(item.maPhong)}
                        className={`room ${item.tenTrangThai !== "Sạch sẽ" ? "not-clear" : ""} ${item.daThue ? "not-avail" : ""}`}>
                        <p>{item.maPhong}</p>
                    </div>
                )
            })}
        </div>
        <div className="price">
            <label htmlFor="priceInput" className='form-label'>Giá phòng</label>
            <input id='priceInput' type="number" className='form-control' 
            name='donGiaMoi' value={donGiaMoi} 
            onChange={(e)=>setDonGiaMoi(e.target.value)}/>
        </div>
    </form>
</div>
  )
}

export default SoDoPopup