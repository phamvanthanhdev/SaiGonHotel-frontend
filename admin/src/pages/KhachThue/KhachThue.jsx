import React, { useContext, useEffect, useRef, useState } from 'react'
import './KhachThue.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import ThemKhachThuePopup from '../../components/ThemKhachThuePopup/ThemKhachThuePopup';

const KhachThue = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const navigate = useNavigate();
    const [phongs, setPhongs] = useState([]);
    const [khachThues, setKhachThues] = useState([]);
    const [khachThueShows, setKhachThueShows] = useState([]);
    const [showThemKhachThuePopup, setShowThemKhachThuePopup] = useState(false);
    const [maPhong, setMaPhong] = useState('tat-ca');
    

    const onHandleChecked = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setMaPhong(value);
            if(value !== 'tat-ca'){
                setKhachThueShows(khachThues.filter((khach) => khach.maPhong === value));
            }else{
                setKhachThueShows(khachThues);
            }
        }
    }

    const getPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hien-tai", { headers: { Authorization: `Bearer ${token}` } });
            setPhongs([]);
            for (let i = 0; i < response.data.length; i++) {
                if(response.data[i].daThue)
                    setPhongs(data => ([ ...data, response.data[i] ]))
            }
            // setPhongs(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getKhachThueHienTai = async()=>{
        try {
            const response = await axios.get(url + "/api/chi-tiet/khach-thue/hien-tai", { headers: { Authorization: `Bearer ${token}` } });
            setKhachThues(response.data);
            setKhachThueShows(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getPhongs();
            getKhachThueHienTai();
        }
    }, [token])

    const onOpenThemKhachThuePopup = ()=>{
        setShowThemKhachThuePopup(true);
    }

    const xoaKhachThue = async(idChiTietPhieuThue, idKhachHang)=>{
        console.log(idChiTietPhieuThue);
        console.log(idKhachHang);
        
        
        const config = {
            params: {idChiTietPhieuThue: idChiTietPhieuThue, idKhachThue: idKhachHang},
            headers: { Authorization: `Bearer ${token}` } 
        }

        try {
            const response = await axios.delete(url + "/api/chi-tiet/del-khach-thue", config);
            if(response.data.code === 200){
                toast.success("Xóa khách lưu trú thành công");
                //refresh
                getKhachThueHienTai();
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
        
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showThemKhachThuePopup &&
                        <ThemKhachThuePopup
                        setShowThemKhachThuePopup={setShowThemKhachThuePopup}
                        phongs={phongs}
                        khachThues={khachThues}
                        setKhachThues={setKhachThues}
                        setKhachThueShows={setKhachThueShows}
                        />
                    }

                    <Navbar />
                    <main className='khach-thue'>
                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Tìm kiếm</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <div className="options">
                                    <div class="form-check form-check-inline">
                                        <input onChange={onHandleChecked} class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="tat-ca" defaultChecked />
                                        <label class="form-check-label" for="inlineRadio1">Tất cả</label>
                                    </div>
                                    {phongs.map((item, index) => {
                                        return (
                                            <div key={index} class="form-check form-check-inline">
                                                <input onChange={onHandleChecked} class="form-check-input" type="radio" name="inlineRadioOptions" id={index} 
                                                    value={item.maPhong} />
                                                <label class="form-check-label" for={index}>{item.maPhong}</label>
                                            </div>
                                        )
                                    })}
                                </div>


                            </div>
                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách khách lưu trú</h3>
                                    <button onClick={onOpenThemKhachThuePopup} className='btn btn-primary'>Thêm khách lưu trú</button>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã phòng</th>
                                            <th>Họ tên</th>
                                            <th>CCCD</th>
                                            <th>Số điện thoại</th>
                                            <th>Ngày nhận phòng</th>
                                            <th>Ngày trả phòng</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            khachThueShows.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}.</td>
                                                        <td>{item.maPhong}</td>
                                                        <td>{item.hoTen}</td>
                                                        <td>{item.cccd}</td>
                                                        <td>{item.sdt}</td>
                                                        <td>{convertDateShow(item.ngayDen)}</td>
                                                        <td>{convertDateShow(item.ngayDi)}</td>
                                                        <td><button onClick={()=>xoaKhachThue(item.idChiTietPhieuThue, item.idKhachHang)} className='btn btn-primary'>Xóa</button></td>
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

export default KhachThue