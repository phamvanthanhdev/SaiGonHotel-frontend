import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import './MyOrders.css'
import OrderItem from '../../components/OrderItem/OrderItem'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom'

const MyOrders = ({ setShowLogin }) => {
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState();
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(5);

    const [dataFilter, setDataFilter] = useState({
        luaChon: '0', // 0 không lọc, 1 lọc theo ngày bắt đầu, 2 - ngày kết thúc, 3 ngày tạo
        ngayBatDauLoc: format(new Date(), "yyyy-MM-dd"),
        ngayKetThucLoc: format(new Date(), "yyyy-MM-dd"),
        trangThai: 3, // 3 - Tất cả, 2 - đã hủy, 1 - hoàn tất, 0 chờ xử lý,
        idPhieuDat: "" //Mã đặt phòng
    })
    const [isFilter, setIsFilter] = useState(false);

    // const fetchOrders = async () => {
    //     try {
    //         const response = await axios.get(url + "/api/phieu-dat/khach-hang", { headers: { Authorization: `Bearer ${token}` } });
    //         setOrders(response.data);
    //     } catch (error) {
    //         console.log(error.message);

    //     }

    // }

    const introspect = async(token) => {
        try {
            const formData = {
                token: token
            }
            const response = await axios.post(url + "/api/tai-khoan/introspect", formData);
            if(!response.data.result.valid){
                setShowLogin(true);
                navigate("/");
            }else{
                setShowLogin(false);
                getTongTrang();
                getPhieuDats(currentPage);
            }
        } catch (error) {
            console.log(response.data);
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            // fetchOrders();
            introspect(token);
            // getTongTrang();
            // getPhieuDats(currentPage);
        }
    }, [token])

    const getTongTrang = async () => {
        try {
            const config = {
                params: { pageSize },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/phieu-dat/khach-hang-tong-trang", config
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
            const response = await axios.get(url + "/api/phieu-dat/khach-hang-theo-trang", config
            );
            if (response.data.code === 200) {
                setOrders(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const onClickPage = (currentPage) => {
        setCurrentPage(currentPage);
        getPhieuDats(currentPage);
    }

    const onClickFilter = async () => {        
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.post(url + "/api/phieu-dat/khach-hang/filter", dataFilter, config);
            if (response.data.code === 200) {
                setOrders(response.data.result);
                setIsFilter(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.response.data.message);
        }
    }

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDataFilter(data => ({ ...data, [name]: value }));
    }

    return (
        <div className='myOrder'>
            <div className="orderContainer">
                <h2>Danh sách đơn đặt phòng</h2>
                <div className="orderWrapper">
                    <div className="orderResult">
                        {orders ?
                            <>
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
                                            disabled={dataFilter.luaChon !== '0' ? false : true} />
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="idSelectGioiTinh" className="form-label">Đến ngày</label>
                                        <input name='ngayKetThucLoc' value={dataFilter.luaChon !== 0 ? dataFilter.ngayKetThucLoc : ''} onChange={onChangeHandle}
                                            type="date" className="form-control" id="noiDung"
                                            disabled={dataFilter.luaChon !== '0' ? false : true} />
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="idSelectGioiTinh" className="form-label">Trạng thái</label>
                                        <select name='trangThai' value={dataFilter.trangThai} onChange={onChangeHandle}
                                            id='idSelectGioiTinh' className="form-select" aria-label="Default select example">
                                            <option value={3}>Tất cả</option>
                                            <option value={0}>Chờ xử lý</option>
                                            <option value={1}>Đã hoàn tất</option>
                                            <option value={2}>Đã hủy</option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="idSelectGioiTinh" className="form-label">Mã phiếu đặt</label>
                                        <input name='idPhieuDat' value={dataFilter.idPhieuDat} onChange={onChangeHandle}
                                            type="text" className="form-control" id="idPhieuDat" placeholder="Nhập mã phiếu đặt phòng" required />

                                    </div>

                                    <button onClick={() => onClickFilter()} className='btn btn-primary btnFilter'>Tìm kiếm</button>

                                </div>

                                {
                                    orders.map((item, index) => {
                                        return (<OrderItem key={index} id={item.idPhieuDat} ngayBatDau={item.ngayBatDau}
                                            ngayTraPhong={item.ngayTraPhong} ghiChu={item.ghiChu}
                                            tienTamUng={item.tienTamUng} idNhanVien={item.idNhanVien}
                                            trangThaiHuy={item.trangThaiHuy} tongTien={item.tongTien}
                                        />)
                                    })
                                }
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
                                            Array.from({ length: totalPage + 1 }, (_, index) => (
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
                            :
                            <p>Loading...</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyOrders