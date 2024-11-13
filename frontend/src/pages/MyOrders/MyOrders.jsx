import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import './MyOrders.css'
import OrderItem from '../../components/OrderItem/OrderItem'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState();
    const pageSize = 5; // Số phần tử trong 1 trang
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(5);

    // const fetchOrders = async () => {
    //     try {
    //         const response = await axios.get(url + "/api/phieu-dat/khach-hang", { headers: { Authorization: `Bearer ${token}` } });
    //         setOrders(response.data);
    //     } catch (error) {
    //         console.log(error.message);

    //     }

    // }

    useEffect(() => {
        if (token) {
            // fetchOrders();
            getTongTrang();
            getPhieuDats(currentPage);
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

    return (
        <div className='myOrder'>
            <div className="orderContainer">
                <h2>Danh sách đơn đặt phòng</h2>
                <div className="orderWrapper">
                    <div className="orderResult">
                        {orders ?
                            <>
                                {
                                    orders.map((item, index) => {
                                        return (<OrderItem key={index} id={item.idPhieuDat} ngayBatDau={item.ngayBatDau}
                                            ngayTraPhong={item.ngayTraPhong} ghiChu={item.ghiChu}
                                            tienTamUng={item.tienTamUng} idNhanVien={item.idNhanVien}
                                            trangThaiHuy={item.trangThaiHuy} tongTien={item.tongTien}
                                        />)
                                    })
                                }

                                <nav className='nav-paging' aria-label="Page navigation example">
                                    <ul class="pagination">
                                        <li class="page-item">
                                            <a class="page-link" href="#" aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                                <span class="sr-only">Previous</span>
                                            </a>
                                        </li>
                                        {
                                            Array.from({ length: totalPage+1 }, (_, index) => (
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