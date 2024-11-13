import React, { useContext, useEffect, useState } from 'react'
import './ThemKhachHang.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemKhachHang = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState({
        cmnd: "",
        hoTen: "",
        sdt: "",
        email: "",
        gioiTinh: true,
        ngaySinh: "",
        diaChi: "",
    })

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name === 'gioiTinh')
            setData(data => ({ ...data, [name]: value === 'false' ? false : true }));
        else
            setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log(data);
        
        try {
            const response = await axios.post(url + "/api/khach-hang/them", data,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Thêm khách hàng thành công");
                setErrorMessage("");
                setData({
                    cmnd: "",
                    hoTen: "",
                    sdt: "",
                    email: "",
                    gioiTinh: true,
                    ngaySinh: "",
                    diaChi: "",
                })
            } else {
                toast.error("Lỗi thêm khách hàng");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi thêm khách hàng");
            setErrorMessage(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {

        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='them-khach-hang'>
                        <div className="them-khach-hang-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Thêm khách hàng mới</h3>
                                </div>
                                <form onSubmit={onSubmitHandler}>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="mb-3">
                                        <label htmlFor="cmnd" className="form-label">Căn cước công dân</label>
                                        <input onChange={onChangeHandle} name='cmnd' value={data.cmnd} type="text" className="form-control" id="maPhong" placeholder="Nhập CCCD" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputHoTen" className="form-label">Họ tên khách hàng</label>
                                        <input onChange={onChangeHandle} name='hoTen' value={data.hoTen} type="text" className="form-control" id="exampleFormControlInputHoTen" placeholder="Nhập họ tên" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="idSelectGioiTinh" className="form-label">Chọn giới tính</label>
                                        <select onChange={onChangeHandle} value={data.gioiTinh} name='gioiTinh' id='idSelectGioiTinh' className="form-select" aria-label="Default select example">
                                            <option value={false}>Nam</option>
                                            <option value={true}>Nữ</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputNgaySinh" className="form-label">Ngày sinh</label>
                                        <input name='ngaySinh' value={data.ngaySinh} onChange={onChangeHandle}
                                            type="date" className="form-control" id="exampleFormControlInputNgaySinh" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputSdt" className="form-label">Số điện thoại</label>
                                        <input onChange={onChangeHandle} name='sdt' value={data.sdt} type="number" className="form-control" id="exampleFormControlInputSdt" placeholder="Nhập số điện thoại" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputEmail" className="form-label">Email</label>
                                        <input onChange={onChangeHandle} name='email' value={data.email} type="text" className="form-control" id="exampleFormControlInputEmail" placeholder="Nhập địa chỉ email" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextareaDiaChi" className="form-label">Nhập địa chỉ</label>
                                        <textarea onChange={onChangeHandle} name='diaChi' value={data.diaChi} className="form-control" id="exampleFormControlTextareaDiaChi" rows="3" required></textarea>
                                    </div>
                                    
                                    <button type="submit" className="btn btn-primary">Xác nhận</button>
                                </form>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default ThemKhachHang