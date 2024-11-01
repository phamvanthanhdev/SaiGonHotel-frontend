import React, { useContext, useEffect, useState } from 'react'
import './QuanLyPhieuDat.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuanLyPhieuDat = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuDats, setphieuDats] = useState([]);
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);

    const getTongTrang = async () => {
        try {
            const config = {
                params: {pageSize },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-dat/tong-trang", config
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

    const getPhieuDats = async (pageNumber) => {
        try {
            const config = {
                params: { pageNumber, pageSize }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-dat/theo-trang", config
            );
            if (response.data.code === 200) {
                setphieuDats(response.data.result);
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
            getPhieuDats(currentPage);
        }
    }, [token])

    const onClickPage = (currentPage)=>{
        setCurrentPage(currentPage);
        getPhieuDats(currentPage);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='quan-ly-phieu-dat'>
                        <div className="quan-ly-phieu-dat-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách phiếu đặt phòng</h3>
                                    {/* <button className='btn btn-primary'>Thêm hạng phòng</button> */}
                                </div>
                                {phieuDats.length > 0 ?
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Mã</th>
                                                    <th>Tên khách hàng</th>
                                                    <th>Ngày nhận phòng</th>
                                                    <th>Ngày trả phòng</th>
                                                    <th>Tạm ứng</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Tiền trả</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày tạo</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    phieuDats.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.idPhieuDat}</td>
                                                                <td>{item.tenKhachHang}</td>
                                                                <td>{convertDateShow(item.ngayBatDau)}</td>
                                                                <td>{convertDateShow(item.ngayTraPhong)}</td>
                                                                <td>{item.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                <td>{item.trangThaiHuy === 2 ? item.tienTra.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 'Không'}</td>
                                                                <td>
                                                                    {item.trangThaiHuy === 0 && 'Chờ xử lý'}
                                                                    {item.trangThaiHuy === 1 && 'Đã hoàn tất'}
                                                                    {item.trangThaiHuy === 2 && 'Đã hủy'}
                                                                </td>
                                                                <td>{convertDateShow(item.ngayTao)}</td>
                                                                <td><button onClick={()=>navigate("/phieu-dat/" + item.idPhieuDat)} className='btn btn-primary'>Chi tiết</button></td>
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

export default QuanLyPhieuDat