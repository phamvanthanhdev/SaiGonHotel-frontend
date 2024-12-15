import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({ setShowLogin }) => {
    const { url, token, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        tenDangNhap: "",
        matKhau: "",
        cmnd: "",
        hoTen: "",
        diaChi: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: false
    })
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name === "gioiTinh"){
            if(value === "1")
                setData(data => ({ ...data, [name]: true }))
            else
                setData(data => ({ ...data, [name]: false }))
        }else{
            setData(data => ({ ...data, [name]: value }))
        }  
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if(currState==="Login"){
            newUrl += "/api/tai-khoan/dang-nhap";
        }else{
            newUrl += "/api/tai-khoan/dang-ky";
        }
        
        try {
            const response = await axios.post(newUrl, data);
            if(response.data.code === 200){
                setToken(response.data.result.token);
                localStorage.setItem("token", response.data.result.token);
                if(currState==="Login"){
                    setSuccessMessage("Đăng nhập thành công");
                    setErrorMessage("");
                    setShowLogin(false);
                }else{
                    setSuccessMessage("Đăng ký thành công");
                    setErrorMessage("");
                }
            }else{
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} action="" className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                </div>
                <div className="login-popup-title">
                    {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
                    {successMessage && <p className='successMessage'>{successMessage}</p>}
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> 
                        : 
                        <>
                            <input onChange={onChangeHandler} name='cmnd' value={data.name} type="number" placeholder='CCCD' required />
                            <input onChange={onChangeHandler} name='hoTen' value={data.name} type="text" placeholder='Họ và tên' required />
                            <input onChange={onChangeHandler} name='sdt' value={data.name} type="number" placeholder='Số điện thoại' required />
                            <input onChange={onChangeHandler} name='email' value={data.name} type="email" placeholder='Email' required />
                            <select name='gioiTinh' onChange={onChangeHandler}>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </select>
                            <input onChange={onChangeHandler} name='ngaySinh' value={data.name} type="date" placeholder='Ngày sinh' required />
                            <input onChange={onChangeHandler} name='diaChi' value={data.name} type="text" placeholder='Địa chỉ' required />
                        </>}
                    <input onChange={onChangeHandler} value={data.tenDangNhap} name='tenDangNhap' type="text" placeholder='Tên đăng nhập' required />
                    <input onChange={onChangeHandler} name='matKhau' value={data.matKhau} type="password" placeholder='Mật khẩu' required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Tôi đồng ý với các điều khoản sử dụng và chính sách bảo mật.</p>
                </div>
                {currState === "Login"
                    ? <p>Tạo tài khoản mới? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Đã có tài khoản? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
                <span onClick={() => setShowLogin(false)} className='close'><FontAwesomeIcon icon={faXmark} /></span>
            </form>
        </div>
    )
}

export default LoginPopup