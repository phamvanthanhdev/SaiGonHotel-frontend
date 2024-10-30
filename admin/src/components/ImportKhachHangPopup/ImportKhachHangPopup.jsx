import React, { useContext, useState } from 'react'
import './ImportKhachHangPopup.css'
import { StoreContext } from '../../context/StoreContext';
import { faXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';

const ImportKhachHangPopup = ({cccd, hoTen, gioiTinh, ngaySinh, sdt, email, diaChi, setShowImportKhachHangPopup}) => {
    const { url, token, setToken } = useContext(StoreContext);
    const [data, setData] = useState({
        cccd: cccd,
        hoTen: hoTen,
        gioiTinh: gioiTinh,
        ngaySinh: ngaySinh,
        sdt: sdt,
        email: email,
        diaChi: diaChi
    })
    const [errorMessage, setErrorMessage] = useState();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const importKhachHang = async()=>{
        try {
            const response = await axios.post(url+"/api/khach-hang/import-khach-hang", data, 
                { headers: { Authorization: `Bearer ${token}` }}
            )

            if(response.data.code === 200){
                toast.success("Import thông tin khách hàng thành công");
                setShowImportKhachHangPopup(false);
            }else{
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
        
    }

    const onSubmit = (event)=>{
        event.preventDefault();
        
        importKhachHang();
    }

    return (
        <div className='import-khachhang-popup'>
            <form onSubmit={onSubmit} action="" className="import-khachhang-popup-container">
                <div className="import-khachhang-popup-title">
                    <h2>Import khách hàng</h2>
                    <FontAwesomeIcon onClick={() => setShowImportKhachHangPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="import-khachhang-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <input onChange={onChangeHandler} value={data.cccd} name='cccd' type="number" placeholder='CCCD' required />
                    <input onChange={onChangeHandler} value={data.hoTen} name='hoTen' type="text" placeholder='Đơn giá' required />
                    <input onChange={onChangeHandler} value={data.gioiTinh} name='gioiTinh' type="text" placeholder='CCCD' required />
                    <input onChange={onChangeHandler} value={data.ngaySinh} name='ngaySinh' type="text" placeholder='CCCD' required />
                    <input onChange={onChangeHandler} value={data.sdt} name='sdt' type="number" placeholder='CCCD' required />
                    <input onChange={onChangeHandler} value={data.email} name='email' type="text" placeholder='CCCD' required />
                    <input onChange={onChangeHandler} value={data.diaChi} name='diaChi' type="text" placeholder='CCCD' required />
                </div>
                <button type='submit'>Xác nhận</button>
            </form>
        </div>
    )
}

export default ImportKhachHangPopup