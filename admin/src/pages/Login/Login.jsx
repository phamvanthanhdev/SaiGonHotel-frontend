import React, { useContext, useEffect, useState } from 'react'
import './Login.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { url, token, setToken, introspect, getThongTinNhanVienDangNhap } = useContext(StoreContext);
    const [data, setData] = useState({
        tenDangNhap: "",
        matKhau: ""
    })
    const [errorMessage, setErrorMessage] = useState("");

    // useEffect(()=>{
    //     if(token)
    //         navigate("/");
    // }, [token])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(url + "/api/tai-khoan/dang-nhap", data);
            if (response.data.code === 200) {
                setToken(response.data.result.token);
                localStorage.setItem("token", response.data.result.token);
                setErrorMessage("");
                navigate("/")
                introspect(localStorage.getItem("token"));
                getThongTinNhanVienDangNhap(localStorage.getItem("token"));
            } else {
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    return (
        <div className="loginContainer">
            <form onSubmit={onLogin}>
                <span>Đăng nhập</span>
                {errorMessage && <p className='error'>{errorMessage}</p>}
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">Tên đăng nhập</label>
                    <input onChange={onChangeHandler} value={data.tenDangNhap} name='tenDangNhap' type="text" id="form2Example1" className="form-control" required />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Mật khẩu</label>
                    <input onChange={onChangeHandler} value={data.matKhau} name='matKhau' type="password" id="form2Example2" className="form-control" required/>
                </div>

                <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">Đăng nhập</button>

            </form>
        </div>
    )
}

export default Login