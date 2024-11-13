import React, { useContext, useEffect, useRef, useState } from 'react'
import './ThongKeTanSuat.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';

const ThongKeTanSuat = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [ngayBatDau, setNgayBatDau] = useState(format(new Date(), "yyyy-MM-dd"));
    const [ngayKetThuc, setNgayKetThuc] = useState(format(new Date(), "yyyy-MM-dd"));
    const [data, setData] = useState([]);
    const [soNgayThongKe, setSoNgayThongKe] = useState(0);
    const [showThongKeNgay, setShowThongKeNgay] = useState(false);

    const getThongKeTanSuat = async () => {
        try {
            const config = {
                params: { ngayBatDau, ngayKetThuc },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/chi-tiet/thong-ke-tan-suat", config);
            if (response.data.code) {
                setData(response.data.result);
                if(response.data.result.length > 0)
                    setSoNgayThongKe(response.data.result[0].soNgayThongKe)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const tinhTongTanSuat = ()=>{
        let tongTanSuat = 0;
        for (let i = 0; i < data.length; i++) {
            tongTanSuat += data[i].tanSuat;
        }
        return tongTanSuat;
    }


    // const calculateDateDifference = (ngayBatDau, ngayKetThuc) => {
    //     const timeDifference = ngayBatDau.getTime() - ngayKetThuc.getTime();
    //     const dayDifference = timeDifference / (1000 * 3600 * 24);
    //     return Math.round(dayDifference);
    // };

    const onClickShowThongKeNgay = ()=>{
        setShowThongKeNgay(!showThongKeNgay);
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='tan-suat'>

                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Tìm kiếm</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <div className='tan-suat-ngay'>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày bắt đầu</label>
                                        <input name='ngay' value={ngayBatDau} onChange={(e) => setNgayBatDau(e.target.value)}
                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Ngày kết thúc</label>
                                        <input name='ngay' value={ngayKetThuc} onChange={(e) => setNgayKetThuc(e.target.value)}
                                            type="date" className="form-control" id="exampleFormControlInput1" />
                                    </div>
                                    <div className='button-search'>
                                        <button onClick={() => getThongKeTanSuat()} type='button' className='btn btn-primary'>Tìm kiếm</button>
                                    </div>
                                </div>
                            </div>
                            <div className="order">
                                <div className="head">
                                    <h3>Thông kê tần suất sử dụng phòng</h3>
                                    {/* <button className='btn btn-primary'>Tạo báo cáo</button> */}
                                </div>
                                <p>Số ngày thống kê: {soNgayThongKe}</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Nội dung</th>
                                            <th>Tần suất(ngày)</th>
                                            <th>Tỉ lệ(%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0
                                            ? data.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr onClick={onClickShowThongKeNgay} key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{item.tenHangPhong}</td>
                                                            <td>{item.tanSuat}</td>
                                                            <td>{item.tiLe}</td>
                                                        </tr>
                                                        {
                                                            showThongKeNgay &&
                                                            item.tanSuatThuePhongs.map((item, index) => {
                                                                return (
                                                                    <tr className='tan-suat-phong' key={index}>
                                                                        <td></td>
                                                                        <td>Phòng {item.maPhong}</td>
                                                                        <td>{item.tanSuat}</td>
                                                                        <td>{item.tiLe}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                    </>
                                                )
                                            })
                                            : <p>Loading...</p>
                                        }

                                        {/* <tr className='tong-tan-suat'>
                                            <td></td>
                                            <td>Tổng cộng</td>
                                            <td>{tinhTongTanSuat()}</td>
                                            <td>{100}</td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </main>
                </section>
            </div>
        </>
    )
}

export default ThongKeTanSuat