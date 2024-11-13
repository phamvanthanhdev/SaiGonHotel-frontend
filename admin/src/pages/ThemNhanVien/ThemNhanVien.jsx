import React, { useContext, useEffect, useState } from 'react'
import './ThemNhanVien.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemNhanVien = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [nhomQuyens, setNhomQuyens] = useState([]);
    const [boPhans, setBoPhans] = useState([]);
    const [data, setData] = useState({
        cccd: "",
        hoTen: "",
        sdt: "",
        email: "",
        gioiTinh: true,
        ngaySinh: "",
        tenDangNhap: "",
        matKhau: "",
        idNhomQuyen: 0,
        idBoPhan: 0,
    })

    const fetchNhomQuyen = async () => {
        try {
            const response = await axios.get(url + "/api/nhom-quyen/all", { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200)
                setNhomQuyens(response.data.result);
            if (response.data.result.length > 0)
                setData(data => ({ ...data, 'idNhomQuyen': response.data.result[0].idNhomQuyen }));
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const fetchBoPhan = async () => {
        try {
            const response = await axios.get(url + "/api/bo-phan/all", { headers: { Authorization: `Bearer ${token}` } });
            setBoPhans(response.data);
            if (response.data.length > 0)
                setData(data => ({ ...data, 'idBoPhan': response.data[0].idBoPhan }));
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'gioiTinh')
            setData(data => ({ ...data, [name]: value === 'false' ? false : true }));
        else
            setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(url + "/api/nhan-vien/", data,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Thêm nhân viên thành công");
                setErrorMessage("");
                setData(data => ({ ...data, 'cccd': "" }));
                setData(data => ({ ...data, 'hoTen': "" }));
                setData(data => ({ ...data, 'sdt': "" }));
                setData(data => ({ ...data, 'email': "" }));
                setData(data => ({ ...data, 'ngaySinh': "" }));
                setData(data => ({ ...data, 'tenDangNhap': "" }));
                setData(data => ({ ...data, 'matKhau': "" }));
            } else {
                toast.error("Lỗi thêm nhân viên");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi thêm nhân viên");
            setErrorMessage(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchNhomQuyen();
            fetchBoPhan();
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='them-nhan-vien'>
                        <div className="them-nhan-vien-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Thêm nhân viên mới</h3>
                                </div>
                                <form onSubmit={onSubmitHandler} class="row g-3 needs-validation" novalidate>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div class="col-md-4">
                                        <label for="validationCustom01" class="form-label">Họ tên</label>
                                        <input name='hoTen' value={data.hoTen} onChange={onChangeHandle} type="text" class="form-control" id="validationCustom01" required />
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="validationCustom02" class="form-label">Căn cước công dân</label>
                                        <input name='cccd' value={data.cccd} onChange={onChangeHandle} type="number" class="form-control" id="validationCustom02" required />
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="validationCustomSdt" class="form-label">Số điện thoại</label>
                                        <div class="input-group has-validation">
                                            <span class="input-group-text" id="inputGroupPrepend">@</span>
                                            <input name='sdt' value={data.sdt} onChange={onChangeHandle} type="number" class="form-control" id="validationCustomSdt" aria-describedby="inputGroupPrepend" required />
                                            <div class="invalid-feedback">
                                                Please choose a username.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="validationCustom03" class="form-label">Địa chỉ email</label>
                                        <input name='email' value={data.email} onChange={onChangeHandle} type="email" class="form-control" id="validationCustom03" required />
                                        <div class="invalid-feedback">
                                            Please provide a valid city.
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="validationCustom04" class="form-label">Giới tính</label>
                                        <select name='gioiTinh' value={data.gioiTinh} onChange={onChangeHandle} class="form-select" id="validationCustom04" required>
                                            <option value={false}>Nam</option>
                                            <option value={true}>Nữ</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid state.
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="validationCustom05" class="form-label">Ngày sinh</label>
                                        <input name='ngaySinh' value={data.ngaySinh} onChange={onChangeHandle} type="date" class="form-control" id="validationCustom05" required />
                                        <div class="invalid-feedback">
                                            Please provide a valid zip.
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="validationCustom06" class="form-label">Tên đăng nhập</label>
                                        <input name='tenDangNhap' value={data.tenDangNhap} onChange={onChangeHandle} type="text" class="form-control" id="validationCustom06" required />
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="validationCustom07" class="form-label">Mật khẩu</label>
                                        <input name='matKhau' value={data.matKhau} onChange={onChangeHandle} type="password" class="form-control" id="validationCustom02" required />
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="validationCustom08" class="form-label">Nhóm quyền</label>
                                        <select name='idNhomQuyen' value={data.idNhomQuyen} onChange={onChangeHandle} class="form-select" id="validationCustom08" required>
                                            {
                                                nhomQuyens.map((item, index) => {
                                                    return <option key={index} value={item.idNhomQuyen}>{item.tenNhomQuyen}</option>
                                                })
                                            }

                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="validationCustom08" class="form-label">Bộ phận</label>
                                        <select name='idBoPhan' value={data.idBoPhan} onChange={onChangeHandle} class="form-select" id="validationCustom08" required>
                                            {
                                                boPhans.map((item, index) => {
                                                    return <option key={index} value={item.idBoPhan}>{item.tenBoPhan}</option>
                                                })
                                            }

                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <button class="btn btn-primary" type="submit">Xác nhận</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default ThemNhanVien