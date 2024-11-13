import React, { useContext, useEffect, useState } from 'react'
import './CapNhatKhachHang.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CapNhatKhachHang = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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

    const getKhachHangById = async()=>{
        try {
            const response = await axios.get(url + "/api/khach-hang/"+ id,
                { headers: { Authorization: `Bearer ${token}` } });
            setData({
                cmnd: response.data.cmnd,
                hoTen: response.data.hoTen,
                sdt: response.data.sdt,
                email: response.data.email,
                gioiTinh: response.data.gioiTinh,
                ngaySinh: response.data.ngaySinh,
                diaChi: response.data.diaChi,
            })
        } catch (error) {
            toast.error("Lỗi get khách hàng");
            setErrorMessage(error.response.data.message);
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(url + "/api/khach-hang/cap-nhat/"+id, data,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Cập nhật khách hàng thành công");
                setErrorMessage("");
            } else {
                toast.error("Lỗi cập nhật khách hàng");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật khách hàng");
            setErrorMessage(error.response.data.message);
        }
    }

    const xoaKhachHang = async()=>{
        try {
            const response = await axios.delete(url + "/api/khach-hang/"+id, 
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Xóa khách hàng thành công");
                setErrorMessage("");
                navigate("/quan-ly-khach-hang")
            } else {
                toast.error("Lỗi xóa khách hàng");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi xóa khách hàng");
            setErrorMessage(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            getKhachHangById();
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='cap-nhat-khach-hang'>
                        <div className="cap-nhat-khach-hang-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Cập nhật khách hàng</h3>
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
                                        <label htmlFor="idSelectGioiTinh" className="form-label">Chọn hạng phòng</label>
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
                                    <button onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')){xoaKhachHang();}}} type='button' className='btn btn-danger'>Xóa khách hàng</button>
                                </form>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default CapNhatKhachHang