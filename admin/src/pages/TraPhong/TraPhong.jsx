import React, { useContext, useEffect, useState } from 'react'
import './TraPhong.css'
import { StoreContext } from '../../context/StoreContext';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const TraPhong = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const location = useLocation();
    const [phongTra, setPhongTra] = useState(location.state.phongTra);
    const [data, setData] = useState();
    const [phanTramGiamGia, setPhanTramGiamGia] = useState(0);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchDataTraPhong = async () => {
        try {
            const response = await axios.post(url + "/api/phieu-thue/thong-tin-tra-phong", phongTra,
                { headers: { Authorization: `Bearer ${token}` } });
            setData(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }

    }

    useEffect(() => {
        if (token) {
            fetchDataTraPhong();
        }
    }, [token])

    const tinhTienKhachTra = () => {
        return (data.tongTien - data.tienTamUng) * (100 - phanTramGiamGia) / 100;
    }

    const traPhong = async () => {
        const dataRequest = {
            idPhieuThue: data.idPhieuThue,
            tienTamUng: data.tienTamUng,
            phanTramGiam: phanTramGiamGia,
            thucThu: tinhTienKhachTra(),
            tongThu: data.tongTien,
            idChiTietPhieuThues: phongTra.idChiTietPhieuThues
        }
        try {
            const response = await axios.post(url + "/api/phieu-thue/tra-phong", dataRequest,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(response.data);
            if(response.data.code === 200){
                handleShow();
            }

        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='tra-phong'>
                        {data ?
                            <div className="table-data">
                                <div className="order">
                                    <div className="head">
                                        <h3>Thanh toán {data.idPhieuThue} - {data.hoTenKhach}</h3>
                                        <i className='bx bx-search' ></i>
                                        <i className='bx bx-filter' ></i>
                                    </div>
                                    <div className='table-chitietphieuthue'>
                                        <p>Thông tin phòng</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Phòng</th>
                                                    <th>Thời gian</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.chiTietPhieuThues.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.tenHangPhong} - {item.maPhong}</td>
                                                            <td>{item.ngayDen} đến {item.ngayDi}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='table-dichvu'>
                                        <p>Dịch vụ</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Tên dịch vụ</th>
                                                    <th>Số lượng</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.chiTietDichVus.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.tenDichVu}</td>
                                                            <td>{item.soLuong}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='table-phuthu'>
                                        <p>Phụ thu</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Tên phụ thu</th>
                                                    <th>Số lượng</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.chiTietPhuThus.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.noiDung}</td>
                                                            <td>{item.soLuong}</td>
                                                            <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{(item.soLuong * item.donGia).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="todo">
                                    <ul className="todo-list">
                                        <li>
                                            <p>Tổng tiền hàng</p>
                                            <p>{data.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                        </li>
                                        <li>
                                            <p>Tiền tạm ứng</p>
                                            <p>{data.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                        </li>
                                        <li>
                                            <p>Giảm giá(%)</p>
                                            <input onChange={(e) => setPhanTramGiamGia(e.target.value)} value={phanTramGiamGia} className='form-control giam-gia' type="number" placeholder='%' />
                                        </li>
                                        <li>
                                            <p>Khách phải trả</p>
                                            <p>{tinhTienKhachTra().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                        </li>
                                        <li>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                                                <label class="form-check-label" for="flexRadioDefault1">
                                                    Tiền mặt
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                <label class="form-check-label" for="flexRadioDefault2">
                                                    Chuyển khoản
                                                </label>
                                            </div>
                                        </li>
                                        <button onClick={traPhong} type='button' className='btn btn-primary'>Hoàn thành</button>
                                    </ul>

                                </div>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Thông tin trả phòng</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Trả phòng thành công, bạn có muốn in hóa đơn không?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Hủy
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                            In hóa đơn
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            : <><p>Loading...</p></>}
                    </main>
                </section>
            </div>
        </>
    )
}

export default TraPhong