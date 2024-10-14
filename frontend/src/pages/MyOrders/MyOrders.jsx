import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import './MyOrders.css'
import OrderItem from '../../components/OrderItem/OrderItem'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState();
    
    const fetchOrders = async () => {
        try {
            const response = await axios.get(url + "/api/phieu-dat/khach-hang", {headers: {Authorization: `Bearer ${token}`}}); 
            setOrders(response.data);
        } catch (error) {
            console.log(error.message);
            
        }
        
    }

    useEffect(() => {
        if(token) {
            console.log(token);
            
            fetchOrders();
        }
    }, [token])

    return (
        <div className='myOrder'>
            <div className="orderContainer">
                <h2>Danh sách đơn đặt phòng</h2>
                <div className="orderWrapper">
                    <div className="orderResult">
                        {orders ?
                            orders.map((item, index) => {
                                return (<OrderItem key={index} id={item.idPhieuDat} ngayBatDau={item.ngayBatDau}
                                    ngayTraPhong={item.ngayTraPhong} ghiChu={item.ghiChu}
                                    tienTamUng={item.tienTamUng} idNhanVien={item.idNhanVien}
                                    trangThaiHuy={item.trangThaiHuy} tongTien={item.tongTien}
                                />)
                            })
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