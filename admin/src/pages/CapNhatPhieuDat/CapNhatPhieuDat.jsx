import React, { useContext, useEffect, useState } from 'react'
import './CapNhatPhieuDat.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { format } from "date-fns";
import CapNhatChiTietPhieuDatPopup from '../../components/QuanLy/CapNhatChiTietPhieuDatPopup/CapNhatChiTietPhieuDatPopup'

const CapNhatPhieuDat = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [idPhieuDat, setIdPhieuDat] = useState(id);
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuDat, setPhieuDat] = useState();
    const [showCapNhatChiTietPhieuDatPopup, setShowCapNhatChiTietPhieuDatPopup] = useState(false);
    const [idHangPhong, setIdHangPhong] = useState();
    const [soLuong, setSoLuong] = useState();
    const [donGia, setDonGia] = useState();
    const [idChiTietPhieuDat, setIdChiTietPhieuDat] = useState();

    const [data, setData] = useState({
        idPhieuDat: null,
        ngayNhanPhong: null,
        ngayTraPhong: null,
        tienTra: null
    })

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const fetchPhieuDat = async () => {
        try {
            const response = await axios.get(url + `/api/phieu-dat/cap-nhat/${idPhieuDat}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setPhieuDat(response.data);
            setData({
                idPhieuDat: response.data.idPhieuDat,
                ngayNhanPhong: response.data.ngayBatDau,
                ngayTraPhong: response.data.ngayTraPhong,
                tienTra: response.data.trangThaiHuy === 2 ? response.data.tienTra : null
            })
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchPhieuDat();
        }
    }, [token])

    const capNhapPhieuDat = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(url + "/api/phieu-dat/", data, config);
            if (response.data.code === 200) {
                fetchPhieuDat();
                toast.success("Cập nhật phiếu đặt thành công");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const xoaPhieuDat = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.delete(url + `/api/phieu-dat/` + idPhieuDat, config);
            if (response.data.code === 200) {
                toast.success("Xóa phiếu đặt thành công");
                navigate("/quan-ly-phieu-dat");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const onClickCapNhat = (idChiTietPhieuDat, idHangPhong, soLuong, donGia) => {
        if (phieuDat.trangThaiHuy === 0) {
            setIdChiTietPhieuDat(idChiTietPhieuDat);
            setIdHangPhong(idHangPhong);
            setSoLuong(soLuong);
            setDonGia(donGia);
            setShowCapNhatChiTietPhieuDatPopup(true);
        }
    }


    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showCapNhatChiTietPhieuDatPopup &&
                        <CapNhatChiTietPhieuDatPopup
                            setShowCapNhatChiTietPhieuDatPopup={setShowCapNhatChiTietPhieuDatPopup}
                            setPhieuDat={setPhieuDat}
                            idChiTietPhieuDat={idChiTietPhieuDat}
                            idPhieuDat={idPhieuDat}
                            idHangPhong={idHangPhong}
                            soLuong={soLuong}
                            donGia={donGia}
                        />
                    }
                    <Navbar />
                    <main className='cap-nhat-phieu-dat'>
                        {phieuDat &&
                            <div className="cap-nhat-phieu-dat-container">
                                <div className="todo">
                                    <div className="phieu-dat">
                                        <div className="head">
                                            <h3>Thông tin phiếu đặt - {idPhieuDat}</h3>
                                            <i className='bx bx-plus' ></i>
                                            <i className='bx bx-filter' ></i>
                                        </div>
                                        <div className="information">
                                            <ul>
                                                <li>
                                                    <p>Ngày nhận phòng:</p>
                                                    <div className="mb-3">
                                                        <input name='ngayNhanPhong' value={data.ngayNhanPhong}
                                                            onChange={onChangeHandle}
                                                            disabled={phieuDat.trangThaiHuy !== 0}
                                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                                    </div>
                                                </li>
                                                <li>
                                                    <p>Ngày trả phòng:</p>
                                                    <div className="mb-3">
                                                        <input name='ngayTraPhong' value={data.ngayTraPhong}
                                                            onChange={onChangeHandle}
                                                            disabled={phieuDat.trangThaiHuy !== 0}
                                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                                    </div>
                                                </li>
                                                <li>
                                                    <p>Đại diện đặt phòng:</p>
                                                    <p>{phieuDat.hoTen}</p>
                                                </li>
                                                <li>
                                                    <p>Tiền tạm ứng</p>
                                                    <p>{phieuDat.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Tổng tiền phiếu đặt:</p>
                                                    <p>{phieuDat.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                </li>
                                                <li>
                                                    <p>Khách hàng còn nợ:</p>
                                                    <p>{phieuDat.trangThaiHuy === 0 ? (phieuDat.tongTien - phieuDat.tienTamUng).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0 VND'}</p>
                                                </li>
                                                <li>
                                                    <p>Lưu ý</p>
                                                    <p>{phieuDat.ghiChu}</p>
                                                </li>
                                                <li>
                                                    <p>Trạng thái</p>
                                                    {phieuDat.trangThaiHuy === 0 && <p>Chờ xử lý</p>}
                                                    {phieuDat.trangThaiHuy === 1 && <p>Đã hoàn tất</p>}
                                                    {phieuDat.trangThaiHuy === 2 && <p>Đã hủy</p>}
                                                </li>
                                                {phieuDat.trangThaiHuy === 2 &&
                                                    <li>
                                                        <p>Tiền hoàn trả</p>
                                                        <div className="mb-3">
                                                            <input name='tienTra' value={data.tienTra}
                                                                onChange={onChangeHandle}
                                                                type="number" className="form-control" id="exampleFormControlInput1" />
                                                        </div>
                                                    </li>
                                                }

                                                <button disabled={phieuDat.trangThaiHuy === 1} onClick={() => capNhapPhieuDat()} className='btn btn-primary'>Cập nhật</button>
                                                <button disabled={phieuDat.trangThaiHuy === 1 || (phieuDat.trangThaiHuy === 0 && phieuDat.tienTamUng > 0)} 
                                                    onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa phiếu đặt này?')) { xoaPhieuDat() }; }} className='btn btn-danger'>Xóa phiếu đặt</button>

                                            </ul>
                                        </div>

                                    </div>

                                </div>

                                <div className="order">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Tên hạng phòng</th>
                                                <th>Đơn giá</th>
                                                <th>Số lượng</th>
                                                <th>Số ngày</th>
                                                <th>Tổng tiền</th>
                                                <th>Còn trống</th>
                                                <th>Cập nhật</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                phieuDat.chiTietResponses.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>
                                                                {item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                            </td>
                                                            <td>
                                                                {item.soLuong} phòng
                                                            </td>
                                                            <td>{item.soNgayThue} ngày</td>
                                                            <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{phieuDat.trangThaiHuy === 0 ? item.soLuongTrong : '--'} phòng</td>
                                                            <td><button disabled={phieuDat.trangThaiHuy !== 0} onClick={() => onClickCapNhat(item.idChiTietPhieuDat ,item.idHangPhong, item.soLuong, item.donGia)} className='btn btn-primary'>Cập nhật</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>



                                </div>

                            </div>
                        }
                    </main>
                </section>
            </div>
        </>
    )
}

export default CapNhatPhieuDat