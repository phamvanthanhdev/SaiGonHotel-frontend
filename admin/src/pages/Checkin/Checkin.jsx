import React, { useContext, useEffect, useState } from 'react'
import './Checkin.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Checkin = () => {
    const navigate = useNavigate();
    const {url, token, isExpand, convertDateShow} = useContext(StoreContext);
    const [phieuDat, setPhieuDat] = useState();
    const [data, setData] = useState({
        cccd: ""
    })
    const [errorMessage, setErrorMessage] = useState("");
    
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const config = {
        params: {cccd:data.cccd}, 
        headers: {Authorization: `Bearer ${token}`}
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(url + "/api/phieu-dat/tim-kiem/cccd", config);
            setPhieuDat(response.data);
            setErrorMessage("");
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }

    const handleOnclick = (id) => {
        navigate(`/phieu-dat/${id}`)
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main>
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
                        {
                            phieuDat && 
                        <div className="table-data">
                            <div className="order">
                                <div className="head">
                                    <h3>Đơn đặt phòng</h3>
                                    <i className='bx bx-search' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Mã phiếu đặt</th>
                                            <th>Thời gian</th>
                                            <th>Tổng giá trị</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {phieuDat.map((item, index) => {
                                            return(
                                                <tr key={index} onClick={()=>handleOnclick(item.idPhieuDat)}>
                                                    <td>{item.idPhieuDat}</td>
                                                    <td>{convertDateShow(item.ngayBatDau)} đến {convertDateShow(item.ngayTraPhong)}</td>
                                                    <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
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
                            </div>

                        </div>
                        }
                    </main>
                </section>
            </div>
        </>
    )
}

export default Checkin