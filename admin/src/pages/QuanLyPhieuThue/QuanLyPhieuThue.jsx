import React, { useContext, useEffect, useState } from 'react'
import './QuanLyPhieuThue.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";

const QuanLyPhieuThue = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuThues, setPhieuThues] = useState([]);
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);
    const [dataFilter, setDataFilter] = useState({
        luaChon: 0, // 0 không lọc, 1 lọc theo ngày bắt đầu, 2 - ngày kết thúc, 3 ngày tạo
        ngayBatDauLoc: format(new Date(), "yyyy-MM-dd"),
        ngayKetThucLoc: format(new Date(), "yyyy-MM-dd"),
        tenKhachHang: "", 
        noiDung: "" //Mã đặt phòng
    })
    const [isFilter, setIsFilter] = useState(false);

    const getTongTrang = async () => {
        try {
            const config = {
                params: { pageSize },
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

    const onClickPage = (currentPage) => {
        setCurrentPage(currentPage);
        getPhieuThues(currentPage);
    }

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDataFilter(data => ({ ...data, [name]: value }));
    }

    const onClickFilter = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.post(url + "/api/phieu-thue/filter", dataFilter, config
            );
            if (response.data.code === 200) {
                setPhieuThues(response.data.result);
                setIsFilter(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='quan-ly-phieu-thue'>
                        <div className="search-container">
                        <div className="col-md-2">
                                <label htmlFor="idSelectGioiTinh" className="form-label">Lựa chọn ngày</label>
                                <select name='luaChon' value={dataFilter.luaChon} onChange={onChangeHandle}
                                    id='idSelectGioiTinh' className="form-select" aria-label="Default select example">
                                    <option value={0}>Không</option>
                                    <option value={1}>Ngày nhận phòng</option>
                                    <option value={2}>Ngày trả phòng</option>
                                    <option value={3}>Ngày đặt</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="idSelectGioiTinh" className="form-label">Từ ngày</label>
                                <input name='ngayBatDauLoc' value={dataFilter.luaChon !== 0 ? dataFilter.ngayBatDauLoc : ''} onChange={onChangeHandle}
                                    type="date" className="form-control" id="noiDung"
                                    disabled={dataFilter.luaChon !== 0 ? false : true} />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="idSelectGioiTinh" className="form-label">Đến ngày</label>
                                <input name='ngayKetThucLoc' value={dataFilter.luaChon !== 0 ? dataFilter.ngayKetThucLoc : ''} onChange={onChangeHandle}
                                    type="date" className="form-control" id="noiDung"
                                    disabled={dataFilter.luaChon !== 0 ? false : true} />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="idSelectGioiTinh" className="form-label">Tên khách hàng</label>
                                <input name='tenKhachHang' value={dataFilter.tenKhachHang} onChange={onChangeHandle}
                                    type="text" className="form-control" id="tenKhachHang" placeholder="Nhập tên khách hàng" required />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="idSelectGioiTinh" className="form-label">Mã phiếu thuê</label>
                                <input name='noiDung' value={dataFilter.noiDung} onChange={onChangeHandle}
                                    type="text" className="form-control" id="noiDung" placeholder="Nhập mã phiếu tìm kiếm" required />
                            </div>
                            
                            <button onClick={() => onClickFilter()} className='btn btn-primary btnFilter'>Tìm kiếm</button>
                        </div>
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
                                                                <td>
                                                                    {item.idPhieuDat ? "Có đặt trước " : "Không đặt trước"}
                                                                    {item.idPhieuDat && <span onClick={() => navigate("/cap-nhat-phieu-dat/" + item.idPhieuDat)}>Xem</span>}
                                                                </td>
                                                                <td>
                                                                    <button onClick={() => navigate("/cap-nhat-phieu-thue/" + item.idPhieuThue)} className='btn btn-primary'>Chi tiết</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        {!isFilter &&
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
                                        }
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