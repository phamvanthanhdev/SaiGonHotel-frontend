import React, { useContext, useEffect, useState } from 'react'
import './QuanLyNhanVien.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import ThemBoPhanPopup from '../../components/QuanLy/ThemBoPhanPopup/ThemBoPhanPopup'

const QuanLyNhanVien = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [nhanViens, setNhanViens] = useState([]);
    const [nhanVienShows, setNhanVienShows] = useState([]);
    const [boPhans, setBoPhans] = useState([]);
    const [showThemBoPhanPopup, setShowThemBoPhanPopup] = useState(false);
    const [isCapNhat, setIsCapNhat] = useState(false);
    const [idBoPhan, setIdBoPhan] = useState();

    const fetchNhanViens = async () => {
        try {
            const response = await axios.get(url + `/api/nhan-vien/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setNhanViens(response.data.result);
            setNhanVienShows(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const fetchBoPhans = async () => {
        try {
            const response = await axios.get(url + `/api/bo-phan/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setBoPhans(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchNhanViens();
            fetchBoPhans();
        }
    }, [token])

    const onClickBoPhan = (tenBoPhan)=>{
        setNhanVienShows(nhanViens.filter(nhanVien => nhanVien.tenBoPhan === tenBoPhan));
    }

    const onClickThemBoPhan = ()=>{
        setIsCapNhat(false);
        setShowThemBoPhanPopup(true);
    }

    const onClickCapNhatBoPhan = (idBoPhan)=>{
        setIsCapNhat(true);
        setIdBoPhan(idBoPhan);
        setShowThemBoPhanPopup(true);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showThemBoPhanPopup &&
                    <ThemBoPhanPopup
                        setShowThemBoPhanPopup={setShowThemBoPhanPopup}
                        isCapNhat={isCapNhat}
                        setBoPhans={setBoPhans}
                        idBoPhan={idBoPhan}
                    />
                    }
                    <Navbar />
                    <main className='nhan-vien'>
                        <div className="nhan-vien-container">
                            <div className="todo">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách bộ phận</h3>
                                    <button onClick={()=>onClickThemBoPhan()} className='btn btn-primary'>Thêm mới</button>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Mã bộ phận</th>
                                            <th>Tên bộ phận</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            boPhans.map((item, index) => {
                                                return (
                                                    <tr onClick={()=>onClickBoPhan(item.tenBoPhan)} key={index}>
                                                        <td>{item.idBoPhan}</td>
                                                        <td>{item.tenBoPhan}</td>
                                                        <td><button onClick={()=>onClickCapNhatBoPhan(item.idBoPhan)} className='btn btn-primary'>Cập nhật</button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>


                            </div>

                            </div>

                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách nhân viên</h3>
                                    <button onClick={()=>navigate("/them-nhan-vien")} className='btn btn-primary'>Thêm mới</button>
                                </div>
                                {nhanVienShows.length > 0 ?
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>CCCD</th>
                                            <th>Tên nhân viên</th>
                                            <th>Giới tính</th>
                                            <th>Ngày sinh</th>
                                            <th>Số điện thoại</th>
                                            <th>Email</th>
                                            <th>Bộ phận</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            nhanVienShows.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index+1}. </td>
                                                        <td>{item.cccd}</td>
                                                        <td>{item.hoTen}</td>
                                                        <td>{item.gioiTinh ? 'Nữ' : 'Nam'}</td>
                                                        <td>{convertDateShow(item.ngaySinh)}</td>
                                                        <td>{item.sdt}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.tenBoPhan}</td>
                                                        <td>
                                                            <button onClick={()=>navigate("/cap-nhat-nhan-vien/"+item.idNhanVien)} className='btn btn-primary'>Cập nhật</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                : <p className='error'>Không có nhân viên nào để hiển thị</p>
                                    }
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default QuanLyNhanVien