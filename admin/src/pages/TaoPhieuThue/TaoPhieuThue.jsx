import React, { useContext, useEffect, useState } from 'react'
import './TaoPhieuThue.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { format } from "date-fns";
import axios from 'axios';
import SoDoPopup from '../../components/SoDoPopup/SoDoPopup';
import { toast } from 'react-toastify';
import SoDoChuaDatPopup from '../../components/SoDoChuaDatPopup/SoDoChuaDatPopup';

const TaoPhieuThue = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const navigate = useNavigate();
    const [ngayNhanPhong, setNgayNhanPhong] = useState(format(new Date(), "yyyy-MM-dd"));
    const [ngayTraPhong, setNgayTraPhong] = useState(format(new Date(), "yyyy-MM-dd"));
    const [hangPhongs, setHangPhongs] = useState([]);
    const [showSodoPopup, setShowSodoPopup] = useState(false);
    const [idHangPhong, setIdHangPhong] = useState();
    const [cccd, setCccd] = useState();
    const [idKhachHang, setIdKhachHang] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [thongTinKhachHang, setThongTinKhachHang] = useState("");
    const [donGia, setDonGia] = useState();
    const [phanTramGiam, setPhanTramGiam] = useState(0);


    const getHangPhong = async (ngayNhanPhong, ngayTraPhong) => {
        try {
            const config = {
                params: { ngayDenDat: ngayNhanPhong, ngayDiDat: ngayTraPhong },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/thong-tin-hang-phong/thoi-gian", config);
            setHangPhongs(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHangPhong(ngayNhanPhong, ngayTraPhong);
        }
    }, [token])

    const onChangeNgayTraPhong = (e) => {
        setNgayTraPhong(e.target.value)
        getHangPhong(ngayNhanPhong, e.target.value);
    }

    const openSoDoPopup = (idHangPhong, donGia) => {
        setIdHangPhong(idHangPhong);
        setDonGia(donGia);
        setShowSodoPopup(true);
    }

    const onChangeCccd = async (e) => {
        const value = e.target.value;
        setCccd(value);
        if (value.length === 12) {
            try {
                const config = {
                    params: { cccd: value },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/khach-hang/tim-kiem-cccd", config);
                if (response.data.code === 200) {
                    setIdKhachHang(response.data.result.idKhachHang);
                    setErrorMessage("");
                    setThongTinKhachHang(response.data.result.hoTen + " - " + response.data.result.sdt);
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
                // toast.error(error.response.data.message);
            }
        } else {
            setErrorMessage("CCCD phải có 12 kí tự");
        }
    }

    const taoPhieuThue = async (e) => {
        e.preventDefault();
        if (!idKhachHang) {
            setErrorMessage("Vui lòng chọn khách hàng đại diện");
        } else {
            const phieuThueRequest = {
                ngayDen: ngayNhanPhong,
                ngayDi: ngayTraPhong,
                idKhachHang: idKhachHang,
                idPhieuDat: null,
                phanTramGiam: phanTramGiam,
                chiTietRequests: []
            }
            try {
                const response = await axios.post(url + "/api/phieu-thue/", phieuThueRequest, { headers: { Authorization: `Bearer ${token}` } });
                if (response.data.code === 200) {
                    navigate(`/phieu-thue`, { state: { idPhieuDat: null, idPhieuThue: response.data.result.idPhieuThue,
                        ngayNhanPhong: response.data.result.ngayDen,
                        ngayTraPhong: response.data.result.ngayDi
                     } })
                    setErrorMessage("");
                    toast.success("Tạo phiếu thuê thành công");
                } else {
                    setErrorMessage(response.data.message)
                }
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message)
            }
        }
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    {showSodoPopup ? <SoDoChuaDatPopup setShowSodoPopup={setShowSodoPopup}
                        ngayNhanPhong={ngayNhanPhong}
                        ngayTraPhong={ngayTraPhong}
                        donGia={donGia}
                        idHangPhong={idHangPhong}
                    // setPhongSelected={setPhongSelected}
                    /> : <></>}
                    <main className='tao-phieu-thue'>
                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Tạo phiếu thuê</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>

                                {/* form */}

                                <form onSubmit={taoPhieuThue}>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="mb-3">
                                        <label for="exampleInputEmail1" className="form-label">CCCD người đại diện</label>
                                        <input type="number" name='cccd' value={cccd} onChange={onChangeCccd} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        <div id="emailHelp" className="form-text">{thongTinKhachHang ? `Khách hàng: ${thongTinKhachHang}` : 'Chưa có khách hàng nào được chọn'}</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày bắt đầu</label>
                                        <input name='ngay' value={ngayNhanPhong} onChange={(e) => setNgayNhanPhong(e.target.value)}
                                            type="date" className="form-control" id="exampleFormControlInput1" disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày kết thúc</label>
                                        <input name='ngay' value={ngayTraPhong} onChange={onChangeNgayTraPhong}
                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                    </div>

                                    <div className="mb-3">
                                        <label for="exampleInputPhanTramGiam" className="form-label">Giảm giá tiền phòng(%)</label>
                                        <input type="number" name='phanTramGiam' value={phanTramGiam} onChange={(e)=>setPhanTramGiam(e.target.value)} placeholder='%' className="form-control" id="exampleInputPhanTramGiam"/>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Xác nhận tạo</button>
                                </form>

                            </div>
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách hạng phòng</h3>

                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tên hạng phòng</th>
                                            <th>Còn trống</th>
                                            <th>Kiểu phòng</th>
                                            <th>Loại phòng</th>
                                            <th>Sức chứa</th>
                                            <th>Giá phòng</th>
                                            <th>Xem phòng trống</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            hangPhongs.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}.</td>
                                                        <td>{item.tenHangPhong}</td>
                                                        <td>{item.soLuongTrong} phòng</td>
                                                        <td>{item.tenKieuPhong}</td>
                                                        <td>{item.tenLoaiPhong}</td>
                                                        <td>{item.soNguoiToiDa} người</td>
                                                        {item.phanTramGiam > 0
                                                            ? <td>
                                                                {item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                                {/* <small>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</small> */}
                                                            </td>
                                                            : <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        }
                                                        <td><button onClick={() => openSoDoPopup(item.idHangPhong, item.phanTramGiam > 0 ? item.giaKhuyenMai : item.giaGoc)}
                                                            className='btn btn-primary'>Xem phòng trống</button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <div className="table-data">
                            <div className='order'>

                                <div className="head">
                                    <h3>Phòng đã chọn</h3>

                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tên hạng phòng</th>
                                            <th>Số phòng</th>
                                            <th>Ngày nhận phòng</th>
                                            <th>Ngày trả phòng</th>
                                            <th>Giá phòng</th>
                                            <th>Thành tiền</th>
                                            <th>Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            hangPhongs.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}.</td>
                                                        <td>{item.tenHangPhong}</td>
                                                        <td>{item.soLuongTrong}</td>
                                                        <td>{item.tenKieuPhong}</td>
                                                        <td>{item.tenLoaiPhong}</td>
                                                        <td>{item.soNguoiToiDa} người</td>
                                                        {item.phanTramGiam > 0 
                                                            ? <td>
                                                                {item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                                <small>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</small>
                                                            </td>
                                                            : <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div> */}
                    </main>
                </section>
            </div>
        </>
    )
}

export default TaoPhieuThue