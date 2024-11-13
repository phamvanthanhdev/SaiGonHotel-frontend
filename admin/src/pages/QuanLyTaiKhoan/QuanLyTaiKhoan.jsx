import React, { useContext, useEffect, useState } from 'react'
import './QuanLyTaiKhoan.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import ThemNhomQuyenPopup from '../../components/QuanLy/ThemNhomQuyenPopup/ThemNhomQuyenPopup'
import CapNhatTaiKhoanPopup from '../../components/QuanLy/CapNhatTaiKhoanPopup/CapNhatTaiKhoanPopup'

const QuanLyTaiKhoan = () => {
    const navigate = useNavigate();
    const { url, token, isExpand } = useContext(StoreContext);
    const [taiKhoans, setTaiKhoans] = useState([]);
    const [taiKhoanShows, setTaiKhoanShows] = useState([]);
    const [nhomQuyens, setNhomQuyens] = useState([]);
    const [showThemNhomQuyenPopup, setShowThemNhomQuyenPopup] = useState(false);
    const [isCapNhat, setIsCapNhat] = useState(false);
    const [idNhomQuyen, setIdNhomQuyen] = useState();
    const [showCapNhatTaiKhoanPopup, setShowCapNhatTaiKhoanPopup] = useState(false);
    const [idTaiKhoan, setIdTaiKhoan] = useState();

    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);

    const fetchNhomQuyens = async () => {
        try {
            const response = await axios.get(url + `/api/nhom-quyen/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setNhomQuyens(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }


    const getTongTrang = async () => {
        try {
            const config = {
                params: {pageSize },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/tai-khoan/tong-trang", config
            );
            if (response.data.code === 200) {
                setTotalPage(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const getTaiKhoans = async (pageNumber) => {
        try {
            const config = {
                params: { pageNumber, pageSize }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/tai-khoan/theo-trang", config
            );
            if (response.data.code === 200) {
                setTaiKhoans(response.data.result);
                setTaiKhoanShows(response.data.result)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }


    useEffect(() => {
        if (token) {
            // fetchTaiKhoans();
            getTongTrang();
            getTaiKhoans(currentPage);
            fetchNhomQuyens();
        }
    }, [token])

    const onClickNhomQuyen = (tenNhomQuyen)=>{
        setTaiKhoanShows(taiKhoans.filter(taiKhoan => taiKhoan.tenNhomQuyen === tenNhomQuyen));
    }

    const onClickThemNhomQuyen = ()=>{
        setIsCapNhat(false);
        setShowThemNhomQuyenPopup(true);
    }

    const onClickCapNhatNhomQuyen = (idNhomQuyen)=>{
        setIsCapNhat(true);
        setIdNhomQuyen(idNhomQuyen);
        setShowThemNhomQuyenPopup(true);
    }

    const onClickPage = (currentPage)=>{
        setCurrentPage(currentPage);
        getTaiKhoans(currentPage);
    }

    const onClickCapNhatTaiKhoan = (idTaiKhoan)=>{
        setIdTaiKhoan(idTaiKhoan);
        setShowCapNhatTaiKhoanPopup(true);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showThemNhomQuyenPopup &&
                    <ThemNhomQuyenPopup
                        setShowThemNhomQuyenPopup={setShowThemNhomQuyenPopup}
                        isCapNhat={isCapNhat}
                        setNhomQuyens={setNhomQuyens}
                        idNhomQuyen={idNhomQuyen}
                    />
                    }
                    {showCapNhatTaiKhoanPopup &&
                    <CapNhatTaiKhoanPopup
                        setShowCapNhatTaiKhoanPopup={setShowCapNhatTaiKhoanPopup}
                        setTaiKhoans={setTaiKhoans}
                        setTaiKhoanShows={setTaiKhoanShows}
                        idTaiKhoan={idTaiKhoan}
                        pageSize={pageSize}
                        pageNumber={currentPage}
                    />
                    }
                    <Navbar />
                    <main className='tai-khoan'>
                        <div className="tai-khoan-container">
                            <div className="todo">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách nhóm quyền</h3>
                                    <button onClick={()=>onClickThemNhomQuyen()} className='btn btn-primary'>Thêm mới</button>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Mã nhóm quyền</th>
                                            <th>Tên nhóm quyền</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            nhomQuyens.map((item, index) => {
                                                return (
                                                    <tr onClick={()=>onClickNhomQuyen(item.tenNhomQuyen)} key={index}>
                                                        <td>{item.idNhomQuyen}</td>
                                                        <td>{item.tenNhomQuyen}</td>
                                                        <td><button onClick={()=>onClickCapNhatNhomQuyen(item.idNhomQuyen)} className='btn btn-primary'>Cập nhật</button></td>
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
                                    <h3>Danh sách tài khoản</h3>
                                    {/* <button onClick={()=>navigate("/them-tai-khoan")} className='btn btn-primary'>Thêm mới</button> */}
                                </div>
                                {taiKhoanShows.length > 0 ?
                                <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên đăng nhập</th>
                                            <th>Nhóm quyền</th>
                                            <th>Người sở hữu</th>
                                            <th>Đối tượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            taiKhoanShows.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index+1}. </td>
                                                        <td>{item.tenDangNhap}</td>
                                                        <td>{item.tenNhomQuyen}</td>
                                                        <td>{item.nguoiSoHuu}</td>
                                                        <td>{item.doiTuong}</td>
                                                        <td>
                                                            <button onClick={()=>onClickCapNhatTaiKhoan(item.idTaiKhoan)} className='btn btn-primary'>Cập nhật</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <nav className='nav-paging' aria-label="Page navigation example">
                                <ul class="pagination">
                                    <li class="page-item">
                                        <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                    </li>
                                    {
                                        Array.from({ length: totalPage }, (_, index) => (
                                            <li key={index} className={`page-item`}>
                                                <a className={`page-link ${index === currentPage ? 'selected' : ''}`} onClick={() => onClickPage(index)}>
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))
                                    }
                                    <li class="page-item">
                                        <a class="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            </>
                                : <p className='error'>Không có tài khoản nào để hiển thị</p>
                                    }
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default QuanLyTaiKhoan