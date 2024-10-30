import React, { useContext, useEffect, useRef, useState } from 'react'
import './DoanhThu.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import InBaoCao from '../../components/InBaoCao/InBaoCao';
import { useReactToPrint } from 'react-to-print';

const DoanhThu = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const navigate = useNavigate();
    const [ngayBatDau, setNgayBatDau] = useState(format(new Date(), "yyyy-MM-dd"));
    const [ngayKetThuc, setNgayKetThuc] = useState(format(new Date(), "yyyy-MM-dd"));
    const [quyBatDau, setQuyBatDau] = useState("1");
    const [quyKetThuc, setQuyKetThuc] = useState("1");
    const [doanhThuNgays, setDoanhThuNgays] = useState([]);
    const [doanhThuThangs, setDoanhThuThangs] = useState([]);
    const [doanhThuQuys, setDoanhThuQuys] = useState([]);

    const [thangBatDau, setThangBatDau] = useState("1");
    const [thangKetThuc, setThangKetThuc] = useState("1");
    const [type, setType] = useState("theo-ngay")
    const [inBaoCao, setInBaoCao] = useState(false);
    const [nhanVien, setNhanVien] = useState();
    const [nam, setNam] = useState();
    // const [tongDoanhThuNgay, setTongDoanhThuNgay] = useState(0); 

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    const optionsThang = [];
    for (let i = 1; i <= 12; i++) {
        optionsThang.push(<option key={i} value={i}>Tháng {i}</option>)
    }

    const optionsNam = [];
    for (let i = 2010; i <= year; i++) {
        optionsNam.push(<option key={i} value={i}>Năm {i}</option>)
    }

    const getDoanhThuNgay = async () => {
        try {
            const config = {
                params: { ngayBatDau, ngayKetThuc },
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.get(url + "/api/hoa-don/doanh-thu/theo-ngay", config);
            setDoanhThuNgays(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getDoanhThuThang = async () => {
        if (parseInt(thangBatDau) > parseInt(thangKetThuc)) {
            toast.error("Tháng bắt đầu phải nhỏ hơn tháng kết thúc.")
        } else {
            try {
                const config = {
                    params: { thangBatDau, thangKetThuc, nam },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/hoa-don/doanh-thu/theo-thang", config);
                setDoanhThuThangs(response.data);
            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            }
        }
    }

    const getDoanhThuQuy = async () => {
        if (parseInt(quyBatDau) > parseInt(quyKetThuc)) {
            toast.error("Quý bắt đầu phải nhỏ hơn quý kết thúc.")
        } else {
            try {
                const config = {
                    params: { quyBatDau, quyKetThuc, nam },
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/hoa-don/doanh-thu/theo-quy", config);
                setDoanhThuQuys(response.data);
            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            }
        }
    }

    const getNhanVienLapPhieu = async()=>{
        try {
            const response = await axios.get(url+"/api/nhan-vien/dang-nhap", {headers: { Authorization: `Bearer ${token}` }});
            setNhanVien(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getDoanhThuNgay();
            getNhanVienLapPhieu();
        }
    }, [token])

    const onTimKiem = () => {
        if (type === "theo-ngay") {
            getDoanhThuNgay();
        } else if (type === "theo-thang") {
            getDoanhThuThang();
        } else if (type === "theo-quy") {
            getDoanhThuQuy();
        }
    }

    const onHandleChecked = (e) => {
        if (e.target.checked) {
            setType(e.target.value)
        }
    }

    const tinhTongDoanhThuNgay = ()=>{
        let tongDoanhThuNgay = 0;
        for (let i = 0; i < doanhThuNgays.length; i++) {
            tongDoanhThuNgay += doanhThuNgays[i].tongTien;
        }
        return tongDoanhThuNgay;
    }

    const tinhTongDoanhThuThang = ()=>{
        let tongDoanhThuThang = 0;
        for (let i = 0; i < doanhThuThangs.length; i++) {
            tongDoanhThuThang += doanhThuThangs[i].doanhThu;
        }
        return tongDoanhThuThang;
    }

    const tinhTongDoanhThuQuy = ()=>{
        let tongDoanhThuQuy = 0;
        for (let i = 0; i < doanhThuQuys.length; i++) {
            tongDoanhThuQuy += doanhThuQuys[i].doanhThu;
        }
        return tongDoanhThuQuy;
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='doanh-thu'>
                        {!inBaoCao &&
                            <div className="table-data">
                                <div className="todo">
                                    <div className="head">
                                        <h3>Tìm kiếm</h3>
                                        <i className='bx bx-plus' ></i>
                                        <i className='bx bx-filter' ></i>
                                    </div>
                                    <div className="options">
                                        <div class="form-check form-check-inline">
                                            <input onChange={onHandleChecked} class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="theo-ngay" defaultChecked />
                                            <label class="form-check-label" for="inlineRadio1">Theo ngày</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input onChange={onHandleChecked} class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="theo-thang" />
                                            <label class="form-check-label" for="inlineRadio2">Theo tháng</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input onChange={onHandleChecked} class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="theo-quy" />
                                            <label class="form-check-label" for="inlineRadio3">Theo quý</label>
                                        </div>
                                    </div>

                                    {type === "theo-ngay" &&
                                        <div className='doanh-thu-ngay'>
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
                                                <button onClick={onTimKiem} className='btn btn-primary'>Tìm kiếm</button>
                                            </div>
                                        </div>}

                                    {type === "theo-thang" &&
                                        <div className='doanh-thu-thang'>
                                            <div className="mb-3">
                                                <label htmlFor="idNam" className="form-label">Chọn năm</label>
                                                <select id='idNam' value={nam} onChange={(e) => setNam(e.target.value)} class="form-select" aria-label="Default select example">
                                                    {
                                                        optionsNam
                                                    }
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="idThangBatDau" className="form-label">Tháng bắt đầu</label>
                                                <select id='idThangBatDau' value={thangBatDau} onChange={(e) => setThangBatDau(e.target.value)} class="form-select" aria-label="Default select example">
                                                    {
                                                        optionsThang
                                                    }
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="idThangKetThuc" className="form-label">Tháng kết thúc</label>
                                                <select id='idThangKetThuc' value={thangKetThuc} onChange={(e) => setThangKetThuc(e.target.value)} class="form-select" aria-label="Default select example">
                                                    {
                                                        optionsThang
                                                    }
                                                </select>
                                            </div>
                                            <div className='button-search'>
                                                <button onClick={onTimKiem} className='btn btn-primary'>Tìm kiếm</button>
                                            </div>
                                        </div>}

                                    {type === "theo-quy" &&
                                        <div className="doanh-thu-quy">

                                            <div className="mb-3">
                                                <label htmlFor="idNam" className="form-label">Chọn năm</label>
                                                <select id='idNam' value={nam} onChange={(e) => setNam(e.target.value)} class="form-select" aria-label="Default select example">
                                                    {
                                                        optionsNam
                                                    }
                                                </select>
                                            </div>

                                            <label htmlFor="idQuyBatDau">Quý bắt đầu</label>
                                            <select id='idQuyBatDau' onChange={(e) => setQuyBatDau(e.target.value)} class="form-select" aria-label="Default select example">
                                                <option value="1">Quý 1</option>
                                                <option value="2">Quý 2</option>
                                                <option value="3">Quý 3</option>
                                                <option value="4">Quý 4</option>
                                            </select>

                                            <label htmlFor="idQuyKetThuc">Quý kết thúc</label>
                                            <select id='idQuyKetThuc' onChange={(e) => setQuyKetThuc(e.target.value)} class="form-select" aria-label="Default select example">
                                                <option value="1">Quý 1</option>
                                                <option value="2">Quý 2</option>
                                                <option value="3">Quý 3</option>
                                                <option value="4">Quý 4</option>
                                            </select>

                                            <div className='button-search'>
                                                <button onClick={onTimKiem} className='btn btn-primary'>Tìm kiếm</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="order">
                                    <div className="head">
                                        <h3>Doanh thu theo ngày</h3>
                                        <button onClick={() => setInBaoCao(true)} className='btn btn-primary'>Tạo báo cáo</button>
                                    </div>
                                    <p>Tổng doanh thu: {type === "theo-ngay" ? tinhTongDoanhThuNgay().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) 
                                                            : type === "theo-thang" ? tinhTongDoanhThuThang().toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) 
                                                            : tinhTongDoanhThuQuy().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Thời gian</th>
                                                <th>Doanh thu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {type === "theo-ngay" &&
                                                doanhThuNgays.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{convertDateShow(item.ngayTao)}</td>
                                                            <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                            {type === "theo-thang" &&
                                                doanhThuThangs.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>Tháng {item.thang}</td>
                                                            <td>{item.doanhThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                            {type === "theo-quy" &&
                                                doanhThuQuys.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>Quý {item.quy}</td>
                                                            <td>{item.doanhThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                        {inBaoCao &&
                            <div className="inBaoCao">
                                <InBaoCao
                                    setInBaoCao={setInBaoCao}
                                    ref={contentRef}
                                    type={type}
                                    ngayBatDau={ngayBatDau}
                                    ngayKetThuc={ngayKetThuc}
                                    thangBatDau={thangBatDau}
                                    thangKetThuc={thangKetThuc}
                                    quyBatDau={quyBatDau}
                                    quyKetThuc={quyKetThuc}
                                    doanhThuNgays={doanhThuNgays}
                                    doanhThuThangs={doanhThuThangs}
                                    doanhThuQuys={doanhThuQuys}
                                    hoTenNhanVien={nhanVien.hoTen}
                                    nam={nam}
                                />
                            </div>
                        }
                    </main>
                </section>
            </div>
        </>
    )
}

export default DoanhThu