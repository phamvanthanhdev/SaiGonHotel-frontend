import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { faFaceSmile, faGauge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Sidebar = () => {
	const { isExpand, role } = useContext(StoreContext);
	const navigate = useNavigate();
	const [menuActive, setMenuActive] =  useState("home");

	const onClickMenu = (name, path)=>{
		// setMenuActive(name);
		// if(menuActive === name)
		// 	navigate(path);
		console.log(name);
		
	}

	return (
		<section id="sidebar" className={isExpand ? 'hide' : ''}>
			<a href="#" className="brand">
				<i className='bx'><FontAwesomeIcon icon={faFaceSmile} /></i>
				<span className="text">Trang quản trị</span>
			</a>
			<ul className="side-menu top">
				<li
				// className="active"
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? ()=>navigate("/"): ''}
				>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Trang chủ</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? ()=>navigate("/so-do-phong"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Sơ đồ phòng</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/check-in"): ''} name="check-in">
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Check-In</span>
					</a>
				</li>
				<li className={role === "STAFF" ? '' : 'disable'}>
					<a 
					onClick={role === "STAFF" ? () => navigate("/phieu-dat-theo-ngay"): ''}>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Phiếu đặt theo ngày</span>
					</a>
				</li>
				<li className={role === "STAFF" ? '' : 'disable'}>
					<a 
					onClick={role === "STAFF" ? () => navigate("/hoa-don"): ''}>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Hóa đơn</span>
					</a>
				</li>
				<li className={role === "STAFF" ? '' : 'disable'}>
					<a 
					onClick={role === "STAFF" ? () => navigate("/khach-hang-upload"): ''}>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Khách hàng tải lên</span>
					</a>
				</li>
				<li className={role === "STAFF" ? '' : 'disable'}>
					<a 
					onClick={role === "STAFF" ? () => navigate("/khach-thue"): ''}>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Khách lưu trú</span>
					</a>
				</li>
			</ul>
			<ul className="side-menu top">
				<span className='title'>Chương trình khuyến mãi</span>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/chuong-trinh-khuyen-mai"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">CT khuyến mãi</span>
					</a>
				</li>
				<span className='title'>Quản lý phòng</span>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/hang-phong"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý hạng phòng</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/chi-tiet-thay-doi-gia-phong"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý giá phòng</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-phong"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phòng</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-trang-thai"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý trạng thái</span>
					</a>
				</li>
				<span className='title'>Quản lý dịch vụ, phụ thu</span>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-dich-vu"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý dịch vụ</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-phu-thu"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phụ thu</span>
					</a>
				</li>
				<span className='title'>Quản lý phiếu đặt, phiếu thuê</span>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-phieu-dat"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phiếu đặt</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-phieu-thue"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý phiếu thuê</span>
					</a>
				</li>
				<span className='title'>Quản lý khách hàng, nhân viên</span>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-khach-hang"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý khách hàng</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-nhan-vien"): ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý nhân viên</span>
					</a>
				</li>
				<li 
				className={role === "STAFF" ? '' : 'disable'}
				onClick={role === "STAFF" ? () => navigate("/quan-ly-tai-khoan") : ''}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Quản lý tài khoản</span>
					</a>
				</li>
				<span className='title'>Doanh thu, thống kê</span>
				<li className={role === "MANAGER" ? '' : 'disable'}>
					<a onClick={role === "MANAGER" ? () => navigate("/doanh-thu") : ''}>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Thống kê doanh thu</span>
					</a>
				</li>
				<li className={role === "MANAGER" ? '' : 'disable'}
				 onClick={role === "MANAGER" ? () => navigate("/thong-ke-tan-suat"): ''}>
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