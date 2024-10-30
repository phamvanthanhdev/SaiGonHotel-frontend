import React, { useContext, useEffect, useState } from 'react'
import './PhieuThue.css'
import { useLocation, useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import SoDoPopup from '../../components/SoDoPopup/SoDoPopup';
import { format } from "date-fns";

const PhieuThue = () => {
	const location = useLocation();
	const [idPhieuThue, setIdPhieuThue] = useState(location.state.idPhieuThue);
	const [idPhieuDat, setIdPhieuDat] = useState(location.state.idPhieuDat);
	const [ngayNhanPhong, setNgayNhanPhong] = useState(location.state.ngayNhanPhong);
	const [ngayTraPhong, setNgayTraPhong] = useState(location.state.ngayTraPhong);
	const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
	const [phieuDat, setPhieuDat] = useState();
	const [showSodoPopup, setShowSodoPopup] = useState(false);
	const [idHangPhong, setIdHangPhong] = useState();
	const [donGia, setDonGia] = useState();
	const [chiTietPhieuThues, setChiTietPhieuThues] = useState([]);
	const [hangPhongs, setHangPhongs] = useState([]);

	const getPhieuDat = async () => {
		try {
			const response = await axios.get(url + `/api/phieu-dat/details/${idPhieuDat}`, { headers: { Authorization: `Bearer ${token}` } });
			setPhieuDat(response.data);
			setHangPhongs(response.data.chiTietResponses);
			
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const getHangPhong = async () => {
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

	const fetchChiTietPhieuThue = async () => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThues(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	useEffect(() => {
		if (token) {
			if (idPhieuDat) {
				getPhieuDat();
			} else {
				getHangPhong();
			}
			fetchChiTietPhieuThue();
		}
	}, [idPhieuThue, token])

	const openSoDoPopup = (idHangPhong, donGia) => {
		setShowSodoPopup(true);
		setIdHangPhong(idHangPhong);
		setDonGia(donGia);
	}

	const removeChiTietPhieuThue = async (idChiTiet) => {
		try {
			const response = await axios.delete(url + `/api/chi-tiet/${idChiTiet}`, { headers: { Authorization: `Bearer ${token}` } });
			if (response.data.code === 200) {
				toast.success("Xóa chi tiết phiếu thuê thành công");
				// refresh data
				fetchChiTietPhieuThue();
				if(!phieuDat)
					getHangPhong();
			} else {
				toast.error("Lỗi xóa chi tiết phiếu thuê");
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const thayDoiThoiGianTraPhong = async (idChiTiet, ngayTraPhong) => {
		const config = {
			params: { ngayTraPhong: format(ngayTraPhong, "yyyy-MM-dd") },
			headers: { Authorization: `Bearer ${token}` }
		}

		try {
			const response = await axios.put(url + `/api/chi-tiet/thay-doi-ngay-tra/${idChiTiet}`, {}, config);
			if (response.data.code === 200) {
				toast.success("Cập nhật thời gian thành công");
				// refresh data
				fetchChiTietPhieuThue();
			} else {
				toast.error("Lỗi cập nhật thời gian");
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message);
		}
	}


	return (
		<>
			<Sidebar />
			<div className='app'>
				<section id="content" className={isExpand && 'expand'}>
					{showSodoPopup ? <SoDoPopup setShowSodoPopup={setShowSodoPopup}
						idPhieuThue={idPhieuThue}
						ngayBatDau={ngayNhanPhong}
						ngayTraPhong={ngayTraPhong}
						donGia={donGia}
						idHangPhong={idHangPhong}
						setChiTietPhieuThues={setChiTietPhieuThues}
						daDatTruoc={phieuDat ? true : false}
						setHangPhongs={setHangPhongs}
					/> : <></>}
					<Navbar />
					<main className='phieu-thue'>
						<div className="table-data">
							<div className="order">
								<div className="head">
									<h3>{phieuDat ? 'Chi tiết phiếu đặt' : 'Danh sách hạng phòng'}</h3>
									<i className='bx bx-search' ></i>
									<i className='bx bx-filter' ></i>
								</div>
								<table>
									<thead>
										<tr>
											<th>Hạng phòng</th>
											<th>Số lượng</th>
											<th>Giá phòng</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>

										{phieuDat && hangPhongs.map((item, index) => {
											return (
												<tr key={index}>
													<td>
														{item.tenHangPhong}
													</td>
													<td>
														{item.soLuong} phòng
													</td>
													<td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
													<td>
														<button
															onClick={() => openSoDoPopup(item.idHangPhong, item.donGia)}
															className='btn btn-primary'>
															Chọn phòng
														</button>
													</td>
												</tr>
											)
										})}

										{!phieuDat && hangPhongs.map((item, index) => {
											return (
												<tr key={index}>
													<td>
														{item.tenHangPhong}
													</td>
													<td>
														{item.soLuongTrong} phòng trống
													</td>
													<td>{item.phanTramGiam > 0 
														? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
														: item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
														}</td>
													<td>
														<button
															onClick={() => openSoDoPopup(item.idHangPhong, item.phanTramGiam > 0 ? item.giaKhuyenMai : item.giaGoc)}
															className='btn btn-primary'>
															Chọn phòng
														</button>
													</td>
												</tr>
											)
										})}

									</tbody>
								</table>
							</div>

						</div>

						<div className="table-data">
							<div className="order">
								<div className="head">
									<h3>Chi tiết phiếu thuê</h3>
									<i className='bx bx-search' ></i>
									<i className='bx bx-filter' ></i>
								</div>
								<table>
									<thead>
										<tr>
											<th>Hạng phòng</th>
											<th>Mã phòng</th>
											<th>Ngày nhận phòng</th>
											<th>Ngày trả phòng</th>
											<th>Giá phòng</th>
											<th>Giảm giá</th>
											<th>Tổng tiền</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>
										{chiTietPhieuThues.map((item, index) => {
											// const [ngayTraPhong, setNgayTraPhong] = useState(item.ngayDi);
											return (
												<tr key={index}>
													<td>{item.tenHangPhong}</td>
													<td>{item.maPhong}</td>
													<td>{convertDateShow(item.ngayDen)}</td>
													<td><input className='form-control' type="date"
														onChange={(e) => thayDoiThoiGianTraPhong(item.idChiTietPhieuThue, e.target.value)}
														value={item.ngayDi} />
													</td>
													<td>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
													<td>{item.tienGiamGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
													<td>{item.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
													<td>
														<button
															onClick={() => removeChiTietPhieuThue(item.idChiTietPhieuThue)}
															className='btn btn-primary'>
															Xóa
														</button>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>

							</div>
							{/* <div className="todo">
								<div className="head">
									<h3>Chi tiết phiếu đặt</h3>
									<i className='bx bx-plus' ></i>
									<i className='bx bx-filter' ></i>
								</div>
								<ul className="todo-list">
									<li className="completed">
										<p>Todo List</p>
										<i className='bx bx-dots-vertical-rounded' ></i>
									</li>
									<li className="completed">
										<p>Todo List</p>
										<i className='bx bx-dots-vertical-rounded' ></i>
									</li>
									<li className="not-completed">
										<p>Todo List</p>
										<i className='bx bx-dots-vertical-rounded' ></i>
									</li>
									<li className="completed">
										<p>Todo List</p>
										<i className='bx bx-dots-vertical-rounded' ></i>
									</li>
									<li className="not-completed">
										<p>Todo List</p>
										<i className='bx bx-dots-vertical-rounded' ></i>
									</li>
								</ul>
							</div> */}
						</div>
					</main>
				</section>
			</div>
		</>
	)
}

export default PhieuThue