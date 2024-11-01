import React, { useContext, useEffect, useState } from 'react'
import './QuanLyPhieuThue.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuanLyPhieuThue = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuThues, setPhieuThues] = useState([]);
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);

    const getTongTrang = async () => {
        try {
            const config = {
                params: {pageSize },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-thue/tong-trang", config
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

    const getPhieuThues = async (pageNumber) => {
        try {
            const config = {
                params: { pageNumber, pageSize }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-thue/theo-trang", config
            );
            if (response.data.code === 200) {
                setPhieuThues(response.data.result);
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
            getPhieuThues(currentPage);
        }
    }, [token])

    const onClickPage = (currentPage)=>{
        setCurrentPage(currentPage);
        getPhieuThues(currentPage);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='quan-ly-phieu-thue'>
                        <div className="quan-ly-phieu-thue-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách phiếu thuê phòng</h3>
                                    {/* <button className='btn btn-primary'>Thêm hạng phòng</button> */}
                                </div>
                                {phieuThues.length > 0 ?
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Mã</th>
                                                    <th>Tên khách hàng</th>
                                                    <th>Ngày nhận phòng</th>
                                                    <th>Ngày trả phòng</th>
                                                    <th>Tạm ứng</th>
                                                    <th>Giảm giá</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Nhân viên xác nhận</th>
                                                    <th>Ngày tạo</th>
                                                    <th>Đặt trước</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    phieuThues.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.idPhieuThue}</td>
                                                                <td>{item.hoTenKhach}</td>
                                                                <td>{convertDateShow(item.ngayDen)}</td>
                                                                <td>{convertDateShow(item.ngayDi)}</td>
                                                                <td>{item.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                <td>{item.phanTramGiam}%</td>
                                                                <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                <td>{item.tenNhanVien}</td>
                                                                <td>{convertDateShow(item.ngayTao)}</td>
                                                                <td>{item.idPhieuDat ? "Có đặt trước" : "Không đặt trước"}</td>
                                                                <td><button onClick={()=>navigate("/cap-nhat-phieu-thue/"+item.idPhieuThue)} className='btn btn-primary'>Chi tiết</button></td>
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

export default QuanLyPhieuThue