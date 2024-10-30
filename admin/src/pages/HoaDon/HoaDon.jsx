import React, { useContext, useEffect, useState } from 'react'
import './HoaDon.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { format } from "date-fns";
import { toast } from 'react-toastify';
import axios from 'axios';
import HoaDonDetailsPopup from '../../components/HoaDonDetailsPopup/HoaDonDetailsPopup';

const HoaDon = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const navigate = useNavigate();
    const [ngay, setNgay] = useState(format(new Date(), "yyyy-MM-dd"));
    const [hoaDons, setHoaDons] = useState([]);
    const [showHoaDonPopup, setShowHoaDonPopup] = useState(false);
    const [soHoaDon, setSoHoaDon] = useState();

    const fetchHoaDonTheoNgay = async()=>{
        try {
            const config = {
                params: {ngay},
                headers: { Authorization: `Bearer ${token}`}
            }
            const response = await axios.get(url+"/api/hoa-don/theo-ngay", config);
            setHoaDons(response.data);
            
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(token){
            fetchHoaDonTheoNgay();
        }
    }, [token])

    const onTimKiem = ()=>{
        fetchHoaDonTheoNgay();
    }

    const onClick = (soHoaDon)=>{
        setSoHoaDon(soHoaDon)
        setShowHoaDonPopup(true);
    } 

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                {showHoaDonPopup ? 
					<HoaDonDetailsPopup
						setShowHoaDonPopup={setShowHoaDonPopup}
                        soHoaDon={soHoaDon}
					/>
					:<></>}
                    <Navbar />
                    <main className='hoa-don'>
                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Tìm kiếm</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Ngày tìm kiếm</label>
                                    <input  name='ngay' value={ngay} onChange={(e)=>setNgay(e.target.value)} 
                                        type="date" className="form-control" id="exampleFormControlInput1" />
                                </div>
                                
                                <div className='button-search'>
                                    <button onClick={onTimKiem} className='btn btn-primary'>Tìm kiếm</button>
                                </div>
                            </div>
                            <div className="order">
                                <div className="head">
                                    <h3>Phiếu đặt theo ngày</h3>
                                    <button className='btn btn-primary'>Tạo báo cáo</button>
                                </div>
                                <div className="note">
                                    <p>(*)Lưu ý tiền dịch vụ và phụ thu không bao gồm phần thanh toán trước</p>
                                    <p>(*)Lưu ý thực thu đã trừ đi số tiền giảm giá và tạm ứng nếu có</p>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Số hóa đơn</th>
                                            <th>Tiền phòng</th>
                                            <th>Tiền dịch vụ</th>
                                            <th>Tiền phụ thu</th>
                                            <th>Thực thu</th>
                                            <th>Nhân viên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            hoaDons.map((item, index) => {
                                                return (
                                                    <tr key={index} onClick={()=>onClick(item.soHoaDon)}>
                                                        <td>{item.soHoaDon}</td>
                                                        <td>{item.tongGiaPhong.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.tongDichVu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.tongPhuThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.tenNhanVien}</td>
                                                    </tr>
                                                )
                                            })
                                        }
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

export default HoaDon