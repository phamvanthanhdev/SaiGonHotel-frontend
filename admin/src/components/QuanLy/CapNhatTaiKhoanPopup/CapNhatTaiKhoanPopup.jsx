import React, { useContext, useEffect, useState } from 'react'
import './CapNhatTaiKhoanPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const CapNhatTaiKhoanPopup = ({ setShowCapNhatTaiKhoanPopup, setTaiKhoans, setTaiKhoanShows, idTaiKhoan, pageSize, pageNumber }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [nhomQuyens, setNhomQuyens] = useState([]);

    const [data, setData] = useState({
        tenDangNhap: "",
        idNhomQuyen: 0
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (token) {
            getNhomQuyens();
            getTaiKhoanTheoId();
        }
    }, [token])

    const getNhomQuyens = async () => {
        try {
            const response = await axios.get(url + `/api/nhom-quyen/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setNhomQuyens(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const refreshTaiKhoans = async () => {
        try {
            const config = {
                params: { pageNumber, pageSize }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/tai-khoan/theo-trang", config
            );
            if (response.data.code === 200) {
                setTaiKhoans(response.data.result);
                setTaiKhoanShows(response.data.result)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const capNhapTaiKhoan = async () => {
        if (idTaiKhoan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/tai-khoan/" + idTaiKhoan, data, config);
                
                refreshTaiKhoans();
                setErrorMessage("");
                setShowCapNhatTaiKhoanPopup(false);
                toast.success("Cập nhật tài khoản thành công");
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const xoaTaiKhoan = async () => {
        if (idTaiKhoan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.delete(url + "/api/tai-khoan/" + idTaiKhoan, config);
                
                if(response.data.code === 200){
                    refreshTaiKhoans();
                    setErrorMessage("");
                    setShowCapNhatTaiKhoanPopup(false);
                    toast.success("Xóa tài khoản thành công");
                }
                
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const getTaiKhoanTheoId = async () => {
        if (idTaiKhoan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/tai-khoan/details/" + idTaiKhoan, config);
                if(response.data.code === 200){
                    setData({
                        tenDangNhap: response.data.result.tenDangNhap,
                        idNhomQuyen: response.data.result.idNhomQuyen
                    })
                }
            } catch (error) {
                console.log(er.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        capNhapTaiKhoan();
    }

    return (
        <div className='tai-khoan-popup'>
            <form onSubmit={onSubmit} action="" className="tai-khoan-popup-container">
                <div className="tai-khoan-popup-title">
                    <h2>Cập nhật tài khoản</h2>
                    <FontAwesomeIcon onClick={() => setShowCapNhatTaiKhoanPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="tai-khoan-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                    <label htmlFor="tenDangNhap">Tên đăng nhập</label>
                    <input id='tenDangNhap' onChange={onChangeHandler} value={data.tenDangNhap} name='tenDangNhap' type="text" placeholder='Nhập tên đăng nhập' required />
                    <label htmlFor="idNhomQuyen">Chọn nhóm quyền</label>
                    <select onChange={onChangeHandler} id='idNhomQuyen' name="idNhomQuyen" value={data.idNhomQuyen}>
                        {
                            nhomQuyens.map((item, index)=>{
                                return (<option key={index} value={item.idNhomQuyen}>{item.tenNhomQuyen}</option>)
                            })
                        }
                    </select>
                </div>

                <div className="capNhat">
                    <button type='submit'>Cập nhật</button>
                    <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) { xoaTaiKhoan() }; }} className='btnXoa' type='button'>Xóa</button>
                </div>
                
            </form>
        </div>
    )
}

export default CapNhatTaiKhoanPopup