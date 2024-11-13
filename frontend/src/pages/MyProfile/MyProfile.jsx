import React, { useContext, useEffect, useState } from 'react'
import "./MyProfile.css"
import MailList from '../../components/MailList/MailList';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const MyProfile = () => {
    const { url, token, convertDateShow } = useContext(StoreContext);
    const [khachHang, setKhachHang] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState({
        idKhachHang: "",
        cmnd: "",
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        sdt: "",
        diaChi: "",
        matKhauCu: null,
        matKhauMoi: null,
        xacNhanMatKhauMoi: null
    })

    useEffect(() => {
        if (token) {
            getKhachHang();
        }
    }, [token])


    const getKhachHang = async () => {
        try {
            const response = await axios.get(url + "/api/khach-hang/profile", { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setKhachHang(response.data.result);
                setData({
                    idKhachHang: response.data.result.idKhachHang,
                    cmnd: response.data.result.cmnd,
                    hoTen: response.data.result.hoTen,
                    ngaySinh: response.data.result.ngaySinh,
                    gioiTinh: response.data.result.gioiTinh,
                    email: response.data.result.email,
                    sdt: response.data.result.sdt,
                    diaChi: response.data.result.diaChi,
                    matKhauCu: null,
                    matKhauMoi: null,
                    xacNhanMatKhauMoi: null
                })
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if(data.matKhauMoi !== data.xacNhanMatKhauMoi){
            setErrorMessage("Mật khẩu xác nhận không chính xác")
        }else{
            try {
                const response = await axios.put(url + "/api/khach-hang/profile", data,
                     { headers: { Authorization: `Bearer ${token}` } });
                if (response.data.code === 200) {
                    setKhachHang(response.data.result);
                    setData({
                        idKhachHang: response.data.result.idKhachHang,
                        cmnd: response.data.result.cmnd,
                        hoTen: response.data.result.hoTen,
                        ngaySinh: response.data.result.ngaySinh,
                        gioiTinh: response.data.result.gioiTinh,
                        email: response.data.result.email,
                        sdt: response.data.result.sdt,
                        diaChi: response.data.result.diaChi,
                        matKhauCu: null,
                        matKhauMoi: null,
                        xacNhanMatKhauMoi: null
                    })
                    setErrorMessage("Cập nhật thông tin thành công");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    };


    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name === 'gioiTinh')
            setData(data => ({ ...data, [name]: value === 'false' ? false : true }));
        else
            setData(data => ({ ...data, [name]: value }));
    }

    return (
        <div>
            {khachHang &&
                <div className="profileContainer">
                    <div className="profileWrapper">
                        <div className="profileprofile">
                            <div className="profileprofileTexts">
                                <h1 className="profileTitle">Thông tin của bạn</h1>
                                <form onSubmit={handleSubmit}>
                                    {errorMessage && 
                                    <div className="md-3"><p className='error'>{errorMessage}</p></div>
                                    }
                                <div className="md-3">
                                    <label className="form-label">Căn cước công dân: <span>*</span></label>
                                    <input name='cmnd' value={data.cmnd} onChange={onChangeHandle}
                                        type="number" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Họ và tên: <span>*</span></label>
                                    <input name='hoTen' value={data.hoTen} onChange={onChangeHandle}
                                        type="text" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Ngày sinh: <span>*</span></label>
                                    <input name='ngaySinh' value={data.ngaySinh} onChange={onChangeHandle}
                                        type="date" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Giới tính: <span>*</span></label>
                                    <select name="gioiTinh" id="" value={data.gioiTinh} onChange={onChangeHandle} required>
                                        <option value={false}>Nam</option>
                                        <option value={true}>Nữ</option>
                                    </select>
                                </div>


                                <div className="md-3">
                                    <label className="form-label">Email: <span>*</span></label>
                                    <input name='email' value={data.email} onChange={onChangeHandle}
                                        type="email" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Số điện thoại: <span>*</span></label>
                                    <input name='sdt' value={data.sdt} onChange={onChangeHandle}
                                        type="number" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Địa chỉ: <span>*</span></label>
                                    <input name='diaChi' value={data.diaChi} onChange={onChangeHandle}
                                        type="text" className="form-control" required />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Mật khẩu cũ: </label>
                                    <input name='matKhauCu' onChange={onChangeHandle} value={data.matKhauCu}
                                        type="password" className="form-control" />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Mật khẩu mới: </label>
                                    <input name='matKhauMoi' onChange={onChangeHandle} value={data.matKhauMoi}
                                        type="password" className="form-control" />
                                </div>

                                <div className="md-3">
                                    <label className="form-label">Xác nhận mật khẩu mới: </label>
                                    <input name='xacNhanMatKhauMoi' onChange={onChangeHandle} value={data.xacNhanMatKhauMoi}
                                        type="password" className="form-control" />
                                </div>

                                <div className="md-3">
                                    <button type='submit' className='btn'>Cập nhật</button>
                                </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <MailList />
                </div>
            }
        </div>
    );
}

export default MyProfile