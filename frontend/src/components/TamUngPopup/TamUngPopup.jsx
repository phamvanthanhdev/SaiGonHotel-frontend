import React, { useContext, useState } from 'react'
import './TamUngPopup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const TamUngPopup = ({ setShowTamUngPopup, idPhieuDat, tongTien }) => {
    const { url, token } = useContext(StoreContext);
    const tienTamUngMin = tongTien * 0.1; // Min 10% tổng tiền
    const [data, setData] = useState({
        idPhieuDat: idPhieuDat,
        luaChon: "0",
        tienTamUng: tienTamUngMin
    })
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        
        if(data.tienTamUng < tienTamUngMin){
            setErrorMessage("Tiền tạm ứng phải lớn hơn 10% tổng tiền");
            return;
        }
        if(data.tienTamUng > tongTien){
            setErrorMessage("Tiền tạm ứng không thể lớn hơn tổng tiền");
            return;
        }
        try {
            const response = await axios.post(url + "/api/payment/create_payment/after", data, 
                {headers: {Authorization: `Bearer ${token}`}});
            if (response.data.status === "OK") {
                setErrorMessage("");
                window.location.href = response.data.url;
            }else{
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Lỗi thanh toán tạm ứng, vui lòng thử lại");
            setErrorMessage("Lỗi thanh toán tạm ứng, vui lòng thử lại");
        }
    }

    return (
        <div className='tam-ung-popup'>
            <form onSubmit={onSubmit} action="" className="tam-ung-popup-container">
                <div className="tam-ung-popup-title">
                    <h2>Thanh toán tạm ứng</h2>
                </div>
                <div className="tam-ung-popup-title">
                    {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
                </div>
                <div className="tam-ung-popup-inputs">
                    <label htmlFor="luaChon">Lựa chọn</label>
                    <select id='luaChon' name='luaChon' onChange={onChangeHandler} value={data.luaChon}>
                        <option value="0">Tạm ứng một phần</option>
                        <option value="1">Tạm ứng toàn bộ</option>
                    </select>

                    <label htmlFor="tienTamUng">Tiền tạm ứng</label>
                    <input id='tienTamUng' disabled={data.luaChon === '1'} onChange={onChangeHandler} value={data.tienTamUng} name='tienTamUng' type="number" placeholder='Tiền tạm ứng' required />
                    <small>(Lớn hơn 10% tổng tiền)</small>
                </div>
                <button type='submit'>Xác nhận</button>
                <span onClick={() => setShowTamUngPopup(false)} className='close'><FontAwesomeIcon icon={faXmark} /></span>
            </form>
        </div>
    )
}

export default TamUngPopup