import React, { useContext, useEffect, useState } from 'react'
import './QuanLyKhachHang.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuanLyKhachHang = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [khachHangs, setKhachHangs] = useState([]);
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);

    const getTongTrang = async () => {
        try {
            const config = {
                params: {pageSize },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/khach-hang/tong-trang", config
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

    const getKhachHangs = async (pageNumber) => {
        try {
            const config = {
                params: { pageNumber, pageSize }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/khach-hang/theo-trang", config
            );
            if (response.data.code === 200) {
                setKhachHangs(response.data.result);
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
            getTongTrang();
            getKhachHangs(currentPage);
        }
    }, [token])

    const onClickPage = (currentPage)=>{
        setCurrentPage(currentPage);
        getKhachHangs(currentPage);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='quan-ly-khach-hang'>
                        <div className="quan-ly-khach-hang-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách khách hàng</h3>
                                    <button onClick={()=>navigate("/them-khach-hang")} className='btn btn-primary'>Thêm mới</button>
                                </div>
                                {khachHangs.length > 0 ?
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Mã</th>
                                                    <th>CCCD</th>
                                                    <th>Tên khách hàng</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Giới tính</th>
                                                    <th>Ngày sinh</th>
                                                    <th>Email</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    khachHangs.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.idKhachHang}</td>
                                                                <td>{item.cmnd}</td>
                                                                <td>{item.hoTen}</td>
                                                                <td>{item.sdt}</td>
                                                                <td>{item.gioiTinh ? 'Nữ' : 'Nam'}</td>
                                                                <td>{convertDateShow(item.ngaySinh)}</td>
                                                                <td>{item.email}</td>
                                                                <td><button onClick={()=>navigate("/cap-nhat-khach-hang/"+item.idKhachHang)} className='btn btn-primary'>Chi tiết</button></td>
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
                                    : <p className='error'>Không có hạng phòng nào</p>}
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default QuanLyKhachHang