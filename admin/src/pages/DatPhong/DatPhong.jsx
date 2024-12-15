import React, { useContext, useEffect, useState } from 'react'
import './DatPhong.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { format } from "date-fns";
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingPopup from '../../components/LoadingPopup/LoadingPopup';

const DatPhong = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const navigate = useNavigate();
    const [ngayNhanPhong, setNgayNhanPhong] = useState(format(new Date(), "yyyy-MM-dd"));
    const [ngayTraPhong, setNgayTraPhong] = useState(format(new Date(), "yyyy-MM-dd"));
    const [hangPhongs, setHangPhongs] = useState([]);
    const [cccd, setCccd] = useState();
    const [tienTamUng, setTienTamUng] = useState(0);
    const [ghiChu, setGhiChu] = useState();
    const [idKhachHang, setIdKhachHang] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [thongTinKhachHang, setThongTinKhachHang] = useState("");
    const [hangPhongChons, setHangPhongChons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const getHangPhong = async (ngayNhanPhong, ngayTraPhong) => {
        try {
            const config = {
                params: { ngayDenDat: ngayNhanPhong, ngayDiDat: ngayTraPhong },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/thong-tin-hang-phong/thoi-gian-2", config);
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

    const onChangeThoiGian = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if(value < format(new Date(), "yyyy-MM-dd")){
            toast.error("Thời gian phải lớn hơn ngày hiện tại");
            return;
        }
        
        if(name === "ngayTraPhong"){
            if(value < ngayNhanPhong){
                toast.error("Thời gian chưa phù hợp");
                return;
            }
            setNgayTraPhong(value);
            getHangPhong(ngayNhanPhong, value);
            setHangPhongChons([]);
        }
        if(name === "ngayNhanPhong"){
            if(value > ngayTraPhong){
                toast.error("Thời gian chưa phù hợp");
                return;
            }
            setNgayNhanPhong(value);
            getHangPhong(value, ngayTraPhong);
            setHangPhongChons([]);
        }
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

    
    const datPhong = async (e) => {
        e.preventDefault();
        if (!idKhachHang) {
            setErrorMessage("Vui lòng chọn khách hàng đại diện đặt phòng");
            return;
        }

        if(hangPhongChons.length <= 0){
            setErrorMessage("Vui lòng chọn hạng phòng");
            return;
        }

        if (tienTamUng > tinhTongTien()) {
            setErrorMessage("Tiền tạm ứng không thể lớn hơn tổng tiền");
            return;
        }

        const phieuDatRequest = {
            ngayBatDau: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            idKhachHang: idKhachHang,
            ghiChu: ghiChu,
            tienTamUng: tienTamUng,
            chiTietRequests: hangPhongChons
        }

        try {
            setIsLoading(true); // Bắt đầu loading
            const response = await axios.post(url + "/api/phieu-dat/dat-phong-2", phieuDatRequest, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                toast.success("Đặt phòng thành công");
                setErrorMessage("");
                setHangPhongChons([]);
                getHangPhong(ngayNhanPhong, ngayTraPhong);
            } else {
                setErrorMessage(response.data.message)
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message)
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    }
     
    const onClickChonHangPhong = (idHangPhong, tenHangPhong, soLuong, donGia, soLuongTrong, tongTien, soNgay)=>{
        // Tạo object hạng phòng mới
        const newHangPhong = { idHangPhong, tenHangPhong, soLuong, donGia, tongTien, soNgay };

        // Kiểm tra nếu hạng phòng đã tồn tại
        setHangPhongChons((prev) => {
            const existingRoomIndex = prev.findIndex(room => room.idHangPhong === idHangPhong);
            if (existingRoomIndex !== -1) {
                // Nếu đã tồn tại, cập nhật số lượng
                const updatedRooms = [...prev];

                if(updatedRooms[existingRoomIndex].soLuong + soLuong > soLuongTrong){
                    toast.error("Không đủ số lượng phòng trống");
                    return updatedRooms;
                }

                updatedRooms[existingRoomIndex] = { 
                    ...updatedRooms[existingRoomIndex], 
                    soLuong: updatedRooms[existingRoomIndex].soLuong + soLuong 
                };
                return updatedRooms;
            }
            // Nếu chưa tồn tại, thêm mới
            return [...prev, newHangPhong];
        });
    }

    const tinhTongTien = ()=>{
        return hangPhongChons.reduce((total, room) => {
            return total + room.soLuong * room.tongTien;
        }, 0);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    {isLoading &&
                        <LoadingPopup/>
                    }
                    <main className='dat-phong'>
                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Đặt phòng</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>

                                {/* form */}

                                <form onSubmit={datPhong}>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="mb-3">
                                        <label for="exampleInputEmail1" className="form-label">Người đại diện đặt phòng</label>
                                        <input placeholder='Nhập CCCD'
                                        type="number" name='cccd' value={cccd} onChange={onChangeCccd} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        <div id="emailHelp" className="form-text">{thongTinKhachHang ? `Khách hàng: ${thongTinKhachHang}` : 'Chưa có khách hàng nào được chọn'}</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày bắt đầu</label>
                                        <input name='ngayNhanPhong' value={ngayNhanPhong} onChange={onChangeThoiGian}
                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày kết thúc</label>
                                        <input name='ngayTraPhong' value={ngayTraPhong} onChange={onChangeThoiGian}
                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputEmail1" className="form-label">Tiền tạm ứng* </label>
                                        <input placeholder='Tiền tạm ứng'
                                        value={tienTamUng}
                                        onChange={(e)=>setTienTamUng(e.target.value)}
                                        required
                                        type="number" name='tienTamUng' className="form-control" id="exampleInputEmail1" />
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputEmail1" className="form-label">Lưu ý</label>
                                        <input placeholder='Lưu ý của khách hàng'
                                        value={ghiChu}
                                        onChange={(e)=>setGhiChu(e.target.value)}
                                        type="text" name='ghiChu' className="form-control" id="exampleInputEmail1" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Đặt phòng</button>
                                </form>

                                {hangPhongChons.length > 0 &&
                                <div className="order">
                                    <div className="head">
                                        <h4>Hạng phòng đã chọn</h4>
                                    </div>
                                    <p>Tổng tiền: {tinhTongTien().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên hạng phòng</th>
                                                <th>Số lượng</th>
                                                <th>Tổng tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                hangPhongChons.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.soLuong} phòng</td>
                                                            <td>{(item.tongTien * item.soLuong).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}/{item.soNgay} ngày</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                }
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
                                            <th>Hành động</th>
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
                                                        {/* {item.phanTramGiam > 0
                                                            ? <td>
                                                                {item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                            </td>
                                                            : <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        } */}
                                                        <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} ({item.soNgay} ngày)</td>
                                                        <td><button disabled={item.soLuongTrong <= 0}
                                                        onClick={()=>onClickChonHangPhong(item.idHangPhong, item.tenHangPhong, 1, 
                                                            item.phanTramGiam > 0 ? item.giaKhuyenMai : item.giaGoc
                                                            , item.soLuongTrong, item.tongTien, item.soNgay)}
                                                        className='btn btn-primary'>Chọn</button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default DatPhong