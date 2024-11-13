import React, { useContext, useEffect, useState } from 'react'
import './ChuongTrinhKhuyenMai.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import ThemKhuyenMaiPopup from '../../components/QuanLy/ThemKhuyenMaiPopup/ThemKhuyenMaiPopup';
import ThemChiTietKmPopup from '../../components/QuanLy/ThemChiTietKmPopup/ThemChiTietKmPopup';
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ChuongTrinhKhuyenMai = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [ ctkm, setCtkm ] = useState([]);
    const [ chiTietKm, setChiTietKm] = useState([]);
    const [ idKm, setIdKm ] = useState(); 
    const [ showThemKhuyenMaiPopup, setShowThemKhuyenMaiPopup ] = useState(false);
    const [ showThemChiTietKmPopup, setShowThemChiTietKmPopup ] = useState(false);
    const [ isCapNhat, setIsCapNhat ] = useState(false);
    const [idHangPhong, setIdHangPhong] = useState();

    const getCtkm = async () => {
        try {
            const response = await axios.get(url + "/api/chuong-trinh-khuyen-mai/all", 
                {headers: { Authorization: `Bearer ${token}` }});
            if(response.data.code === 200){
                setCtkm(response.data.result);
                if(response.data.result.length > 0)
                    getChiTietKm(response.data.result[0].idKhuyenMai);
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            // toast.error(error.message);
        }
    }

    useEffect(() => {
        if(token){
            getCtkm();
            getChiTietKm();
        }
    }, [token])

    const getChiTietKm = async (idKm) => {
        try {
            const response = await axios.get(url + "/api/chi-tiet-khuyen-mai/ctkm/" + idKm, 
                {headers: { Authorization: `Bearer ${token}` }});
            if(response.data.code === 200){
                setChiTietKm(response.data.result);
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            // toast.error(error.message);
        }
    }

    const onClickCtkm = async(idKhuyenMai) =>{
        setIdKm(idKhuyenMai);
        getChiTietKm(idKhuyenMai);
    }

    const onOpenThemKhuyenMaiPopup = ()=>{
        setIsCapNhat(false);
        setShowThemKhuyenMaiPopup(true);
    }

    const onOpenThemChiTietKmPopup = ()=>{
        setIsCapNhat(false)
        setShowThemChiTietKmPopup(true);
    }

    const onCapNhatCtkm = (idKhuyenMai)=>{
        setIsCapNhat(true);
        setIdKm(idKhuyenMai);
        setShowThemKhuyenMaiPopup(true);
    }

    const onCapNhatChiTietKm = (idKhuyenMai, idHangPhong)=>{
        setIsCapNhat(true);
        setIdKm(idKhuyenMai);
        setIdHangPhong(idHangPhong);
        setShowThemChiTietKmPopup(true);
    }

    return (
        <>
            <Sidebar />
			<div className='app'>
				<section id="content" className={isExpand && 'expand'}>
                    {showThemKhuyenMaiPopup &&
                    <ThemKhuyenMaiPopup
                        setShowThemKhuyenMaiPopup={setShowThemKhuyenMaiPopup}
                        setCtkm={setCtkm}
                        isCapNhat={isCapNhat}
                        idKhuyenMai={idKm}
                    />
                    }

                    {showThemChiTietKmPopup &&
                    <ThemChiTietKmPopup
                        setShowThemChiTietKmPopup={setShowThemChiTietKmPopup}
                        setChiTietKm={setChiTietKm}
                        ctkm={ctkm}
                        isCapNhat={isCapNhat}
                        idKhuyenMai={idKm}
                        idHangPhong={idHangPhong}
                    />
                    }
					<Navbar />
					<main className='khuyen-mai'>
						<div className="khuyen-mai-container">
							<div className="todo">
								<div className="todo-khuyen-mai">
									<div className="head">
										<h3>Chương trình khuyến mãi</h3>
										<button onClick={()=>onOpenThemKhuyenMaiPopup()} className='btn btn-primary'>Thêm</button>
									</div>

									<ul className="todo-list">
										{ctkm.map((item, index) => {
											return (
												<li onClick={()=>onClickCtkm(item.idKhuyenMai)} key={index} className="completed">
													<div className="content">
														<p>Áp dụng từ {convertDateShow(item.ngayBatDau)} đến {convertDateShow(item.ngayKetThuc)}</p>
														<p><small>Tên chương trình: {item.moTa}</small></p>
                                                        <p><small>Nhân viên tạo: {item.tenNhanVien}</small></p>
													</div>
                                                    <div className="content">
                                                        <FontAwesomeIcon className='btnSetting' onClick={()=>onCapNhatCtkm(item.idKhuyenMai)} icon={faGear} />
													</div>
												</li>
											)
										})}
									</ul>
								</div>
							</div>

							<div className="order">
								<div className="head">
                                    <h3>Danh sách hạng phòng được khuyến mãi</h3>
                                    <button onClick={()=>onOpenThemChiTietKmPopup()} className='btn btn-primary'>Thêm chi tiết</button>
                                </div>
                                {chiTietKm.length > 0 ?
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Hạng phòng</th>
                                            <th>Phần trăm</th>
                                            <th>Tiền giảm</th>
                                            <th>Giá gốc</th>
                                            <th>Giá khuyến mãi</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            chiTietKm.map((item, index) => {
                                                return (
                                                    <tr onClick={()=>onCapNhatChiTietKm(item.idKhuyenMai, item.idHangPhong)} key={index}>
                                                        <td>{index+1}. </td>
                                                        <td>{item.tenHangPhong}</td>
                                                        <td>{item.phanTramGiam} %</td>
                                                        {/* <td>{item.dangApDung ? item.tienGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : "- - VND"}</td> */}
                                                        <td>{item.tienGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        {/* <td>{item.dangApDung ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : "- - VND"}</td> */}
                                                        <td>{item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.trangThai}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                : <p className='error'>Không có hạng phòng nào trong chương khuyến mãi này!</p>}
							</div>

						</div>
					</main>
				</section>
			</div>
		</>
    )
}

export default ChuongTrinhKhuyenMai