import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { faFaceSmile, faGauge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Sidebar = () => {
	const { isExpand } = useContext(StoreContext);
	const navigate = useNavigate();

	return (
		<section id="sidebar" className={isExpand ? 'hide' : ''}>
			<a href="#" className="brand">
				<i className='bx'><FontAwesomeIcon icon={faFaceSmile} /></i>
				<span className="text">Trang quản trị</span>
			</a>
			<ul className="side-menu top">
				<li onClick={() => navigate("/")} className="active">
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Trang chủ</span>
					</a>
				</li>
				<li onClick={() => navigate("/so-do-phong")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Sơ đồ phòng</span>
					</a>
				</li>
				<li onClick={() => navigate("/check-in")} name="check-in">
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Check-In</span>
					</a>
				</li>
				<li>
					<a onClick={() => navigate("/phieu-dat-theo-ngay")} className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Phiếu đặt theo ngày</span>
					</a>
				</li>
				<li>
					<a onClick={() => navigate("/hoa-don")} className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Hóa đơn</span>
					</a>
				</li>
				<li>
					<a onClick={() => navigate("/doanh-thu")} className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Doanh thu</span>
					</a>
				</li>
				<li>
					<a onClick={() => navigate("/khach-hang-upload")} className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Khách hàng tải lên</span>
					</a>
				</li>
				<li>
					<a onClick={() => navigate("/khach-thue")} className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Khách lưu trú</span>
					</a>
				</li>
			</ul>
			<ul className="side-menu top">
				<li onClick={() => navigate("/chuong-trinh-khuyen-mai")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Khuyến mãi</span>
					</a>
				</li>
				<li onClick={() => navigate("/hang-phong")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý hạng phòng</span>
					</a>
				</li>
				<li onClick={() => navigate("/chi-tiet-thay-doi-gia-phong")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý giá phòng</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-phong")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phòng</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-dich-vu")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý dịch vụ</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-phu-thu")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phụ thu</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-phieu-dat")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phiếu đặt</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-phieu-thue")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phiếu thuê</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-trang-thai")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý trạng thái</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-khach-hang")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý khách hàng</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-nhan-vien")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý nhân viên</span>
					</a>
				</li>
				<li onClick={() => navigate("/quan-ly-tai-khoan")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý tài khoản</span>
					</a>
				</li>
				<li onClick={() => navigate("/thong-ke-tan-suat")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Thống kê tần suất</span>
					</a>
				</li>
			</ul>
			<ul className="side-menu">
				<li>
					<a className=''>
						<i className='bx bxs-cog' ></i>
						<span className="text">Settings</span>
					</a>
				</li>
				<li>
					<a className="logout">
						<i className='bx bxs-log-out-circle' ></i>
						<span className="text">Logout</span>
					</a>
				</li>
			</ul>
		</section>
	)
}

export default Sidebar