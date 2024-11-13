import React, { useContext, useEffect, useState } from 'react'
import './CapNhatNhanVien.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CapNhatNhanVien = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { url, token, isExpand } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [boPhans, setBoPhans] = useState([]);
    const [data, setData] = useState({
        cccd: "",
        hoTen: "",
        sdt: "",
        email: "",
        gioiTinh: true,
        ngaySinh: "",
        tenDangNhap: "",
        idNhomQuyen: 0,
        idBoPhan: 0,
    })

    const fetchBoPhan = async () => {
        try {
            const response = await axios.get(url + "/api/bo-phan/all", { headers: { Authorization: `Bearer ${token}` } });
            setBoPhans(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const getNhanVienById = async () => {
        try {
            const response = await axios.get(url + "/api/nhan-vien/details/" + id, { headers: { Authorization: `Bearer ${token}` } });
            if(response.data.code === 200)
                setData({
                    cccd: response.data.result.cccd,
                    hoTen: response.data.result.hoTen,
                    sdt: response.data.result.sdt,
                    email: response.data.result.email,
                    gioiTinh: response.data.result.gioiTinh,
                    ngaySinh: response.data.result.ngaySinh,
                    tenDangNhap: response.data.result.tenDangNhap,
                    idNhomQuyen: response.data.result.idNhomQuyen,
                    idBoPhan: response.data.result.idBoPhan,
                })
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
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
            const response = await axios.put(url + "/api/nhan-vien/"+id, data,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Cập nhật nhân viên thành công");
                setErrorMessage("");
            } else {
                toast.error("Lỗi cập nhật nhân viên");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật nhân viên");
            setErrorMessage(error.response.data.message);
        }
    }

    const xoaNhanVien = async()=>{
        try {
            const response = await axios.delete(url + "/api/nhan-vien/"+id, 
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Xóa nhân viên thành công");
                setErrorMessage("");
                navigate("/quan-ly-nhan-vien")
            } else {
                toast.error("Lỗi xóa nhân viên");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi xóa nhân viên");
            setErrorMessage(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchBoPhan();
            getNhanVienById();
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='cap-nhat-nhan-vien'>
                        <div className="cap-nhat-nhan-vien-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Cập nhật nhân viên</h3>
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
                                        <button onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')){xoaNhanVien();}}} class="btn btn-danger" type="button">Xóa nhân viên</button>
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

export default CapNhatNhanVien