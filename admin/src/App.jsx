import { useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Checkin from './pages/Checkin/Checkin';
import PhieuDatDetails from './pages/PhieuDatDetails/PhieuDatDetails';
import PhieuThue from './pages/PhieuThue/PhieuThue';
import SoDoPhong from './pages/SoDoPhong/SoDoPhong';
import ChiTietPhieuThue from './pages/ChiTietPhieuThue/ChiTietPhieuThue';
import TraPhong from './pages/TraPhong/TraPhong';
import PhieuDatTheoNgay from './pages/PhieuDatTheoNgay/PhieuDatTheoNgay';
import HoaDon from './pages/HoaDon/HoaDon';
import DoanhThu from './pages/DoanhThu/DoanhThu';
import TaoPhieuThue from './pages/TaoPhieuThue/TaoPhieuThue';
import InHoaDon from './pages/InHoaDon/InHoaDon';
import KhachHangUpload from './pages/KhachHangUpload/KhachHangUpload';
import KhachThue from './pages/KhachThue/KhachThue';
import ChuongTrinhKhuyenMai from './pages/ChuongTrinhKhuyenMai/ChuongTrinhKhuyenMai';
import HangPhong from './pages/HangPhong/HangPhong';
import ThemHangPhong from './pages/ThemHangPhong/ThemHangPhong';
import CapNhatHangPhong from './pages/CapNhatHangPhong/CapNhatHangPhong';
import ChiTietThayDoiGiaPhong from './pages/ChiTietThayDoiGiaPhong/ChiTietThayDoiGiaPhong';
import QuanLyPhong from './pages/QuanLyPhong/QuanLyPhong';
import ThemPhong from './pages/ThemPhong/ThemPhong';
import CapNhatPhong from './pages/CapNhatPhong/CapNhatPhong';
import QuanLyDichVu from './pages/QuanLyDichVu/QuanLyDichVu';
import QuanLyPhuThu from './pages/QuanLyPhuThu/QuanLyPhuThu';
import ThongKeTanSuat from './pages/ThongKeTanSuat/ThongKeTanSuat';
import QuanLyPhieuDat from './pages/QuanLyPhieuDat/QuanLyPhieuDat';
import QuanLyPhieuThue from './pages/QuanLyPhieuThue/QuanLyPhieuThue';
import CapNhatPhieuThue from './pages/CapNhatPhieuThue/CapNhatPhieuThue';
import QuanLyTrangThai from './pages/QuanLyTrangThai/QuanLyTrangThai';
import QuanLyKhachHang from './pages/QuanLyKhachHang/QuanLyKhachHang';
import ThemKhachHang from './pages/ThemKhachHang/ThemKhachHang';
import CapNhatKhachHang from './pages/CapNhatKhachHang/CapNhatKhachHang';
import QuanLyNhanVien from './pages/QuanLyNhanVien/QuanLyNhanVien';
import ThemNhanVien from './pages/ThemNhanVien/ThemNhanVien';
import CapNhatNhanVien from './pages/CapNhatNhanVien/CapNhatNhanVien';
import QuanLyTaiKhoan from './pages/QuanLyTaiKhoan/QuanLyTaiKhoan';
import CapNhatPhieuDat from './pages/CapNhatPhieuDat/CapNhatPhieuDat';
import DatPhong from './pages/DatPhong/DatPhong';

function App() {
 
  return (
    <>
      <ToastContainer />
      {/* <Sidebar/>
      <div className='app'>
        <section id="content"> */}
          {/* <Navbar/> */}
          <Routes>
            <Route path="/" element={<SoDoPhong />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<Checkin />} />
            <Route path="/phieu-dat/:id" element={<PhieuDatDetails />} />
            <Route path="/phieu-thue" element={<PhieuThue />} />
            <Route path="/so-do-phong" element={<SoDoPhong />} />
            <Route path="/chi-tiet-phieu-thue" element={<ChiTietPhieuThue />} />
            <Route path="/tra-phong" element={<TraPhong />} />
            <Route path="/phieu-dat-theo-ngay" element={<PhieuDatTheoNgay />} />
            <Route path="/hoa-don" element={<HoaDon />} />
            <Route path="/doanh-thu" element={<DoanhThu />} />
            <Route path="/tao-phieu-thue" element={<TaoPhieuThue />} />
            <Route path="/dat-phong" element={<DatPhong />} />
            <Route path="/in-hoa-don" element={<InHoaDon />} />
            <Route path="/khach-hang-upload" element={<KhachHangUpload />} />
            <Route path='/khach-thue' element={<KhachThue />}/>
            <Route path='/chuong-trinh-khuyen-mai' element={<ChuongTrinhKhuyenMai />}/>
            <Route path='/hang-phong' element={<HangPhong />}/>
            <Route path='/them-hang-phong' element={<ThemHangPhong />}/>
            <Route path='/cap-nhat-hang-phong/:id' element={<CapNhatHangPhong />}/>
            <Route path='/chi-tiet-thay-doi-gia-phong' element={<ChiTietThayDoiGiaPhong />}/>
            <Route path='/quan-ly-phong' element={<QuanLyPhong />}/>
            <Route path='/them-phong' element={<ThemPhong />}/>
            <Route path='/cap-nhat-phong/:maPhong' element={<CapNhatPhong />}/>
            <Route path='/quan-ly-dich-vu' element={<QuanLyDichVu />}/>
            <Route path='/quan-ly-phu-thu' element={<QuanLyPhuThu />}/>
            <Route path='/quan-ly-phieu-dat' element={<QuanLyPhieuDat />}/>
            <Route path='/quan-ly-phieu-thue' element={<QuanLyPhieuThue />}/>
            <Route path="/cap-nhat-phieu-thue/:id" element={<CapNhatPhieuThue />} />
            <Route path="/quan-ly-trang-thai" element={<QuanLyTrangThai />} />
            <Route path="/quan-ly-khach-hang" element={<QuanLyKhachHang />} />
            <Route path="/them-khach-hang" element={<ThemKhachHang />} />
            <Route path="/cap-nhat-khach-hang/:id" element={<CapNhatKhachHang />} />
            <Route path="/quan-ly-nhan-vien" element={<QuanLyNhanVien />} />
            <Route path="/them-nhan-vien" element={<ThemNhanVien />} />
            <Route path="/cap-nhat-nhan-vien/:id" element={<CapNhatNhanVien />} />
            <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
            <Route path="/cap-nhat-phieu-dat/:id" element={<CapNhatPhieuDat />} />
            <Route path='/thong-ke-tan-suat' element={<ThongKeTanSuat />}/>
          </Routes>
        {/* </section> */}
      {/* </div> */}
    </>
  )
}

export default App
