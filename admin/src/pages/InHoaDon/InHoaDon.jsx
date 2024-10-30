import React, { useContext, useRef, useState } from 'react'
import './InHoaDon.css'
import { StoreContext } from '../../context/StoreContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import HoaDonDetails from '../../components/HoaDonDetails/HoaDonDetails';
import ReactToPrint, { useReactToPrint } from "react-to-print";

const InHoaDon = () => {
    const { token, isExpand, convertDateShow } = useContext(StoreContext);
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    
    const location = useLocation();
    const [idPhieuThue, setIdPhieuThue] = useState(location.state.idPhieuThue);
    const [ngayNhanPhong, setNgayNhanPhong] = useState(location.state.ngayNhanPhong);
    const [ngayTraPhong, setNgayTraPhong] = useState(location.state.ngayTraPhong);
    const [hoTenKhach, setHoTenKhach] = useState(location.state.hoTenKhach);
    const [hoTenNhanVien, setHoTenNhanVien] = useState(location.state.hoTenNhanVien);
    const [tienTamUng, setTienTamUng] = useState(location.state.tienTamUng);
    const [phanTramGiam, setPhanTramGiam] = useState(location.state.phanTramGiam);
    const [tongThu, setTongThu] = useState(location.state.tongThu);
    const [thucThu, setThucThu] = useState(location.state.thucThu);
    const [soHoaDon, setSoHoaDon] = useState(location.state.soHoaDon);
    const [ngayTaoHoaDon, setNgayTaoHoaDon] = useState(location.state.ngayTaoHoaDon);

    const [chiTietPhieuThues, setChiTietPhieuThues] = useState(location.state.chiTietPhieuThues);
    const [chiTietDichVus, setChiTietDichVus] = useState(location.state.chiTietDichVus);
    const [chiTietPhuThus, setChiTietPhuThus] = useState(location.state.chiTietPhuThus);

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='in-hoa-don'>
                        <div className="head-title">
                            <div className="left">

                            </div>
                            <div className="right">
                                <button onClick={reactToPrintFn} className='btn btn-primary'>In hóa đơn</button>
                            </div>
                        </div>
                        <div ref={contentRef} className="table-data">
                            <div className="order">
                                <div className="head">
                                    <h1>HÓA ĐƠN</h1>
                                </div>
                                <div className="information">
                                    <div className="left">
                                        <p>Số hóa đơn: {soHoaDon}</p>
                                        <p>Tên khách hàng: {hoTenKhach}</p>
                                        <p>Thời gian lập: {convertDateShow(ngayTaoHoaDon)}</p>
                                        
                                    </div>
                                    <div className="right">
                                        <p>Mã phiếu thuê: {idPhieuThue}</p>
                                        <p>Lưu trú: {convertDateShow(ngayNhanPhong)} đến {convertDateShow(ngayTraPhong)}</p>
                                        <p>Nhân viên lập: {hoTenNhanVien}</p>
                                    </div>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Phòng thuê/Dịch Vụ/Phụ Thu</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Tổng tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chiTietPhieuThues.map((item, index) => {
                                            return (
                                                <tr key={`PT${index}`}>
                                                    <td>{item.tenHangPhong}({item.maPhong})</td>
                                                    <td>{convertDateShow(item.ngayDen)} đến {convertDateShow(item.ngayDi)}</td>
                                                    <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                    <td>{item.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            )
                                        })}
                                        {chiTietDichVus.map((item, index) => {
                                            return (
                                                <tr key={`DV${index}`}>
                                                    <td>{item.tenDichVu}</td>
                                                    <td>{item.soLuong} đơn vị</td>
                                                    <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                    <td>{(item.donGia*item.soLuong).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            )
                                        })}
                                        {chiTietPhuThus.map((item, index) => {
                                            return (
                                                <tr key={`PT${index}`}>
                                                    <td>{item.noiDung}</td>
                                                    <td>{item.soLuong} đơn vị</td>
                                                    <td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                    <td>{(item.donGia*item.soLuong).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="price">
                                    <p>Tiền tạm ứng: {tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <p>Phần trăm giảm: {phanTramGiam}%</p>
                                    <h4>Tổng tiền: {tongThu !== thucThu && <small><del>{tongThu}</del></small>} {thucThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</h4>
                                </div>
                                <div className="note">
                                    <p>(*)Lưu ý tiền dịch vụ và phụ thu không bao gồm phần thanh toán trước</p>
                                    <p>(*)Lưu ý thực thu đã trừ đi số tiền giảm giá và tạm ứng nếu có</p>
                                </div>
                                <hr />
                                <div className="contact">
                                    <ul>
                                        <li>Điện thoại hỗ trợ: 0394321091</li>
                                        <li>Email: saigon-hotel@gmail.com</li>
                                        <li>Địa chỉ: 97 Man Thiện, phường Hiệp Phú, TP Thủ Đức, TP Hồ Chí Minh</li>
                                        <li>Cảm ơn bạn đã lựa chọn chúng tôi giữa muôn vàn những lựa chọn khác!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default InHoaDon
