import React, { useContext, useEffect, useState } from 'react'
import './ChiTietPhieuThue.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { faMinus, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { format } from "date-fns";
import ThemDichVuPhuThuPopup from '../../components/ThemDichVuPhuThuPopup/ThemDichVuPhuThuPopup'
import ChonPhongTraPopup from '../../components/ChonPhongTraPopup/ChonPhongTraPopup'
import ThueThemPopup from '../../components/ThueThemPopup/ThueThemPopup'

const ChiTietPhieuThue = () => {
	// const idPhieuThue = useParams().id;
	const location = useLocation();
	const [idPhieuThue, setIdPhieuThue] = useState(location.state.idPhieuThue);
	const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
	const [phieuThue, setPhieuThue] = useState();
	const [chiTietPhieuThues, setChiTietPhieuThues] = useState([]);
	const [chiTiet, setChiTiet] = useState();
	const [dichVus, setDichVus] = useState([]);
	const [phuThus, setPhuThus] = useState([]);
	const [chiTietDichVus, setChiTietDichVus] = useState([]);
	const [chiTietPhuThus, setChiTietPhuThus] = useState([]);
	const [showDichVuPhuThuPopup, setShowDichVuPhuThuPopup] = useState(false);
	const [showChonPhongTraPopup, setShowChonPhongTraPopup] = useState(false);
	const [tienGiamGia, setTienGiamGia] = useState();
	const [showThueThemPopup, setShowThueThemPopup] = useState(false);
	const [phanTramGiam, setPhanTramGiam] = useState(0);

	const fetchPhieuThue = async () => {
		try {
			const response = await axios.get(url + `/api/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setPhieuThue(response.data);
			setPhanTramGiam(response.data.phanTramGiam);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const fetchChiTietPhieuThues = async () => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThues(response.data);
			if (response.data.length > 0) {
				const idChiTietPhieuThue = response.data[0].idChiTietPhieuThue;
				fetchChiTietPhieuThueById(idChiTietPhieuThue);
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const fetchDichVus = async () => {
		try {
			const response = await axios.get(url + "/api/dich-vu/all",
				{ headers: { Authorization: `Bearer ${token}` } });

			setDichVus(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const fetchPhuThus = async () => {
		try {
			const response = await axios.get(url + "/api/phu-thu/all",
				{ headers: { Authorization: `Bearer ${token}` } });

			setPhuThus(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	useEffect(() => {
		if (token) {
			fetchChiTietPhieuThues();
			fetchDichVus();
			fetchPhuThus();
			fetchPhieuThue();
		}
	}, [token])

	const fetchChiTietPhieuThueById = async (idChiTiet) => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/${idChiTiet}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTiet(response.data);
			setTienGiamGia(response.data.tienGiamGia)
			// Fetch DichVu - Phu Thu
			fetchChiTietDichVus(idChiTiet);
			fetchChiTietPhuThus(idChiTiet);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const fetchChiTietDichVus = async (idChiTiet) => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/dich-vu/${idChiTiet}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietDichVus(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const fetchChiTietPhuThus = async (idChiTiet) => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phu-thu/${idChiTiet}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhuThus(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const handleClickChiTiet = (idChiTiet) => {
		fetchChiTietPhieuThueById(idChiTiet);
	}

	const xoaChiTietSuDungDichVu = async (idChiTietSuDungDichVu) => {
		try {
			const response = await axios.delete(url + "/api/chi-tiet/dich-vu",
				{ 	params: {idChiTietSuDungDichVu},
					headers: { Authorization: `Bearer ${token}` } });
			
			if(response.data.code === 200){
				toast.success("Xóa chi tiết dịch vụ thành công")
				//refresh
				fetchChiTietDichVus(chiTiet.idChiTietPhieuThue);
				refreshChiTietPhieuThue(chiTiet.idChiTietPhieuThue);
				refreshChiTietPhieuThues();
				fetchPhieuThue();
			}
		} catch (error) {
			console.log(error.response.data.message);
			toast.error(error.message);
		}
	}

	const xoaChiTietPhuThu = async (idChiTietPhuThu) => {
		try {
			const response = await axios.delete(url + "/api/chi-tiet/phu-thu",
				{ 
					params: {idChiTietPhuThu},
					headers: { Authorization: `Bearer ${token}` } 
				});
			if(response.data.code){
				toast.success("Xóa chi tiết phụ thu thành công")
				//refresh
				fetchChiTietPhuThus(chiTiet.idChiTietPhieuThue);
				refreshChiTietPhieuThue(chiTiet.idChiTietPhieuThue);
				refreshChiTietPhieuThues();
				fetchPhieuThue();
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const thayDoiThoiGianTraPhong = async (e) => {
		const config = {
			params: { ngayTraPhong: format(e.target.value, "yyyy-MM-dd") },
			headers: { Authorization: `Bearer ${token}` }
		}

		try {
			const response = await axios.put(url + `/api/chi-tiet/thay-doi-ngay-tra/${chiTiet.idChiTietPhieuThue}`, {}, config);
			if (response.data.code === 200) {
				toast.success("Cập nhật thời gian thành công");
				// refresh data
				fetchChiTietPhieuThueById(chiTiet.idChiTietPhieuThue);
				refreshChiTietPhieuThues();
				fetchPhieuThue();
			} else {
				toast.error("Lỗi cập nhật thời gian");
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message);
		}
	}

	const thayDoiPhanTramGiam = async (e) => {
		if (phanTramGiam < 0 || phanTramGiam > 100) {
			toast.error("Phần trăm giảm giá chưa phù hợp");
		} else {
			const config = {
				params: { idPhieuThue, phanTramGiam },
				headers: { Authorization: `Bearer ${token}` }
			}

			try {
				const response = await axios.put(url + `/api/phieu-thue/phan-tram-giam`, {}, config);
				if (response.data.code === 200) {
					toast.success("Cập nhật giảm giá thành công");
					// refresh data
					fetchPhieuThue();
				} else {
					toast.error("Lỗi cập nhật giảm giá");
				}
			} catch (error) {
				console.log(error.message);
				toast.error(error.response.data.message);
			}
		}
	}

	const [idDichVuPhuThu, setIdDichVuPhuThu] = useState();
	const [tenDichVuPhuThu, setTenDichVuPhuThu] = useState();
	const [donGia, setDonGia] = useState();
	const [type, setType] = useState("");

	const openDichVuPhuThuPopup = async (id, ten, donGia, type) => {
		if (chiTiet.daThanhToan) {
			toast.error("Phòng này đã được thanh toán");
		} else {
			setIdDichVuPhuThu(id);
			setTenDichVuPhuThu(ten);
			setDonGia(donGia);
			setType(type);
			setShowDichVuPhuThuPopup(true);
		}
	}

	const capNhatTienGiamGia = async () => {
		const config = {
			params: { tienGiamGia: tienGiamGia },
			headers: { Authorization: `Bearer ${token}` }
		}

		try {
			const response = await axios.put(url + `/api/chi-tiet/thay-doi-tien-giam/${chiTiet.idChiTietPhieuThue}`, {}, config);
			if (response.data.code === 200) {
				toast.success("Cập nhật tiền giảm giá thành công");
				// refresh data
				setChiTiet(response.data.result);
				refreshChiTietPhieuThues();
				fetchPhieuThue();
			} else {
				toast.error("Lỗi cập nhật tiền giảm giá");
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message);
		}
	}

	const refreshChiTietPhieuThue = async (idChiTiet) => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/${idChiTiet}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTiet(response.data);
			setTienGiamGia(response.data.tienGiamGia);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const refreshChiTietPhieuThues = async () => {
		try {
			const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
				{ headers: { Authorization: `Bearer ${token}` } });
			setChiTietPhieuThues(response.data);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	}

	const onClickThueThem = () => {
		setShowThueThemPopup(true);
	}

	return (
		<>
			<Sidebar />
			<div className='app'>
				<section id="content" className={isExpand && 'expand'}>
					{showDichVuPhuThuPopup ?
						<ThemDichVuPhuThuPopup
							setShowDichVuPhuThuPopup={setShowDichVuPhuThuPopup}
							idDichVuPhuThu={idDichVuPhuThu}
							tenDichVuPhuThu={tenDichVuPhuThu}
							donGia={donGia}
							type={type}
							idChiTiet={chiTiet.idChiTietPhieuThue}
							setChiTietDichVus={setChiTietDichVus}
							setChiTietPhuThus={setChiTietPhuThus}
							setChiTietPhieuThue={setChiTiet}
							idPhieuThue={idPhieuThue}
							setChiTietPhieuThues={setChiTietPhieuThues}
							setPhieuThue={setPhieuThue}
						/>
						: <></>}

					{showChonPhongTraPopup ?
						<ChonPhongTraPopup
							idPhieuThue={phieuThue.idPhieuThue}
							setShowPhongTraPopup={setShowChonPhongTraPopup}
						/>
						: <></>}

					{showThueThemPopup ?
						<ThueThemPopup
							setShowThueThemPopup={setShowThueThemPopup}
							ngayDi={phieuThue.ngayDi}
							idPhieuThue={idPhieuThue}
							setChiTietPhieuThues={setChiTietPhieuThues}
							setPhieuThue={setPhieuThue}
							setPhanTramGiam={setPhanTramGiam}
						/>
						: <></>}

					<Navbar />
					<main className='chitiet'>
						{phieuThue &&
							<div className="chitiet-container">
								<div className="todo">
									<div className="phongdoan">
										<div className="head">
											<h3>Quản lý phiếu thuê - {idPhieuThue}</h3>
											<i className='bx bx-plus' ></i>
											<i className='bx bx-filter' ></i>
										</div>
										<div className="information">
											<h6>Thông tin</h6>
											<ul>
												<li>
													<p>Lưu trú:</p>
													<p>từ {convertDateShow(phieuThue.ngayDen)} đến {convertDateShow(phieuThue.ngayDi)}</p>
												</li>
												<li>
													<p>Tổng tiền phòng:</p>
													<p>{phieuThue.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Tổng tiền dịch vụ:</p>
													<p>{phieuThue.tongTienDichVu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Tổng tiền phụ thu:</p>
													<p>{phieuThue.tongTienPhuThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Tiền tạm ứng:</p>
													<p>{phieuThue.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Tiền tiền tất cả:</p>
													<p>{phieuThue.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Giảm giá tiền phòng:</p>
													<p>{phieuThue.tienDuocGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
												<li>
													<p>Tiền phải trả:</p>
													<p>{phieuThue.tienPhaiTra.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												</li>
											</ul>
										</div>
										<div className="input-giam-gia">
											<label for="exampleInputPhanTramGiam" className="form-label">Giảm giá tiền phòng(%)</label>
											<input type="number" name='phanTramGiam' value={phanTramGiam} onChange={(e) => setPhanTramGiam(e.target.value)} 
												placeholder='%' className="form-control" id="exampleInputPhanTramGiam" />
											<button onClick={()=>thayDoiPhanTramGiam()} className='btn btn-primary'>Cập nhật</button>
										</div>
										<div className="head-phong">
											<p>Danh sách phòng</p>
										</div>
										<ul className="todo-list">
											{chiTietPhieuThues.map((item, index) => {
												return (
													<li key={index} onClick={() => handleClickChiTiet(item.idChiTietPhieuThue)} className="completed">
														<div className="content">
															<p>{item.maPhong} - {item.tenHangPhong}</p>
															<p><small>Thời gian: {convertDateShow(item.ngayDen)} đến {convertDateShow(item.ngayDi)}</small></p>
														</div>
														<div className="content">
															<p>{item.daThanhToan ? "Đã trả phòng" : "Đang thuê"}</p>
														</div>
														<div className="price">
															<p>{item.tongTienTatCa.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
														</div>
													</li>
												)
											})}
										</ul>
										<FontAwesomeIcon onClick={() => onClickThueThem()} className='btnThueThem' icon={faPlus} />
									</div>
									<div className="dichvu">
										<div className="head">
											Dịch vụ
										</div>
										<ul className="todo-list">
											{dichVus.map((item, index) => {
												return (
													<li key={index}>
														<div className="content">
															<p>{item.tenDichVu}</p>
														</div>
														<div>
															<p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
														</div>
														<div className="price">
															<button onClick={() => openDichVuPhuThuPopup(item.idDichVu, item.tenDichVu, item.donGia, "dichvu")} className='btn btn-success'>Thêm</button>
														</div>
													</li>
												)
											})}

										</ul>
									</div>

									<div className="phuthu">
										<div className="head">
											Phụ thu
										</div>
										<ul className="todo-list">
											{phuThus.map((item, index) => {
												return (
													<li key={index}>
														<div className="content">
															<p>{item.noiDung}</p>
														</div>
														<div>
															<p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
														</div>
														<div className="price">
															<button className='btn btn-success' onClick={() => openDichVuPhuThuPopup(item.idPhuThu, item.noiDung, item.donGia, "phuthu")}>Thêm</button>
														</div>
													</li>
												)
											})}
										</ul>
									</div>
								</div>

								<div className="order">
									<div className='head'>
										<div className='left'>
											<p>Khách hàng: {phieuThue.hoTenKhach} - {phieuThue.cmnd}</p>

										</div>
										<div className="right">
											<button onClick={() => setShowChonPhongTraPopup(true)} className='btn btn-primary'>Trả phòng</button>
										</div>
									</div>
									{chiTiet &&
										<>
											<div className='chitiet-phieuthue'>
												<h5>{chiTiet.tenHangPhong}</h5>
												<p>Mã phòng: {chiTiet.maPhong}</p>
												<p>Ngày nhận phòng: {convertDateShow(chiTiet.ngayDen)}</p>
												<div className="date">
													<p>Ngày trả phòng: </p>
													<input className='form-control' type='date' value={chiTiet.ngayDi} onChange={thayDoiThoiGianTraPhong} />
												</div>
												{/* <p>Thời gian: 5 ngày</p> */}
												<p>Đơn giá: {chiTiet.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												<div className="tienGiamGia">
													<p>Tiền giảm giá: </p>
													<input className='form-control' type='number' value={tienGiamGia} onChange={(e) => setTienGiamGia(e.target.value)} />
													<button onClick={() => capNhatTienGiamGia()} className='btn btn-primary'>Cập nhật</button>
												</div>
												<p>Tổng tiền phòng: {chiTiet.tongTienPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												<p>Tổng tiền dịch vụ: {chiTiet.tongTienDichVu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												<p>Tổng tiền phụ thu: {chiTiet.tongTienPhuThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
												<p>Tiền khách phải trả: {chiTiet.tongTienTatCa.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
											</div>


											<ul className="dichvu-list">
												<div className="head-list">
													<h6>Dịch vụ đã sử dụng</h6>
												</div>
												{chiTietDichVus.map((item, index) => {
													return (
														<li key={index}>
															<p>
																{!item.daThanhToan &&
																<FontAwesomeIcon
																onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa chi tiết sử dụng dịch vụ này?')){xoaChiTietSuDungDichVu(item.idChiTietSuDungDichVu);}}}
																className="icon" icon={faTrashCan} />
																}
															</p>
															<p>{item.tenDichVu}</p>
															{/* <p><FontAwesomeIcon className="icon" icon={faMinus} />&nbsp;&nbsp;{item.soLuong}&nbsp;&nbsp;<FontAwesomeIcon className="icon" icon={faPlus} /></p> */}
															<p>{item.soLuong}</p>
															<p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
															<p>{(item.donGia * item.soLuong).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
															<p>{convertDateShow(item.ngayTao)}</p>
															<p>{item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>

														</li>
													)
												})}
											</ul>
											<ul className="phuthu-list">
												<div className="head-list">
													<h6>Danh sách phụ thu</h6>
												</div>
												{chiTietPhuThus.map((item, index) => {
													return (
														<li key={index}>
															<p>
																{!item.daThanhToan &&
																<FontAwesomeIcon
																onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa chi tiết sử dụng phụ thu này?')){xoaChiTietPhuThu(item.idChiTietPhuThu);}}}																className="icon" icon={faTrashCan} />
																}
															</p>
															<p>{item.noiDung}</p>
															{/* <p><FontAwesomeIcon className="icon" icon={faMinus} />&nbsp;&nbsp;{item.soLuong}&nbsp;&nbsp;<FontAwesomeIcon className="icon" icon={faPlus} /></p> */}
															<p>{item.soLuong}</p>
															<p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
															<p>{(item.donGia * item.soLuong).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
															<p>{convertDateShow(item.ngayTao)}</p>
															<p>{item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
														</li>
													)
												})}
											</ul>
										</>}
								</div>

							</div>
						}
					</main>
				</section>
			</div>
		</>
	)
}

export default ChiTietPhieuThue