import React, { useContext, useEffect, useState } from 'react'
import './Checkin.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Checkin = () => {
    const navigate = useNavigate();
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [phieuDat, setPhieuDat] = useState([]);
    const [data, setData] = useState({
        cccd: ""
    })
    const [errorMessage, setErrorMessage] = useState("");
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0); // Số trang
    const [totalPage, setTotalPage] = useState(0);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    // const config = {
    //     params: { cccd: data.cccd },
    //     headers: { Authorization: `Bearer ${token}` }
    // }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // try {
        //     const response = await axios.get(url + "/api/phieu-dat/tim-kiem/cccd", config);
        //     setPhieuDat(response.data);
        //     setErrorMessage("");
        // } catch (error) {
        //     console.log(error.message);
        //     setErrorMessage(error.response.data.message);
        // }
        getTongTrang();
        getPhieuDats(currentPage);
    }

    const handleOnclick = (id) => {
        navigate(`/phieu-dat/${id}`)
    }

    const onClickPage = (currentPage) => {
        setCurrentPage(currentPage);
        getPhieuDats(currentPage);
    }

    const getTongTrang = async () => {
        try {
            const config = {
                params: { pageSize, cccd: data.cccd },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-dat/cccd-tong-trang", config
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
                params: { pageNumber, pageSize, cccd: data.cccd }, // Trang và số phần tử trong 1 trang
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-dat/cccd-theo-trang", config
            );
            if (response.data.code === 200) {
                setPhieuDat(response.data.result);
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
                    <main className='check-in'>
                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Tìm kiếm</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>

                                <div className="checkinContainer">
                                    <form onSubmit={handleSubmit}>
                                        {errorMessage && <p className='error'>{errorMessage}</p>}
                                        <div data-mdb-input-init className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form2Example1">Căn cước công dân</label>
                                            <input onChange={onChangeHandler} value={data.cccd} name='cccd' type="text" id="form2Example1" className="form-control" required />
                                        </div>

                                        <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">Tìm kiếm</button>

                                    </form>
                                </div>
                            </div>

                            <div className="order">

                                <div className="head">
                                    <h3>Đơn đặt phòng</h3>
                                    <i className='bx bx-search' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                {phieuDat.length > 0 ?
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Mã phiếu đặt</th>
                                                    <th>Thời gian</th>
                                                    <th>Tổng giá trị</th>
                                                    <th>Ngày đặt</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {phieuDat.map((item, index) => {
                                                    return (
                                                        <tr key={index} onClick={() => handleOnclick(item.idPhieuDat)}>
                                                            <td>{item.idPhieuDat}</td>
                                                            <td>{convertDateShow(item.ngayBatDau)} đến {convertDateShow(item.ngayTraPhong)}</td>
                                                            <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{convertDateShow(item.ngayTao)}</td>
                                                            <td>
                                                                {item.trangThaiHuy === 0 && <span className="status process"> Chờ xử lý</span>}
                                                                {item.trangThaiHuy === 1 && <span className="status completed">Hoàn thành</span>}
                                                                {item.trangThaiHuy === 2 && <span className="status pending">Đã hủy</span>}
                                                            </td>
                                                            
                                                        </tr>
                                                    )
                                                })}

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
                                    : <p className='error'>Không có phiếu đặt nào</p>}
                            </div>

                        </div>

                    </main>
                </section>
            </div>
        </>
    )
}

export default Checkin