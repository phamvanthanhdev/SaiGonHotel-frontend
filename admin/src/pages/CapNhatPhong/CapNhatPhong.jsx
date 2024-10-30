import React, { useContext, useEffect, useState } from 'react'
import './CapNhatPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CapNhatPhong = () => {
    const { maPhong } = useParams();
    const { url, token, isExpand } = useContext(StoreContext);
    const [hangPhongs, setHangPhongs] = useState([]);
    const [trangThais, setTrangThais] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState({
        maPhong: "",
        tang: 0,
        moTa: "",
        idHangPhong: 0,
        idTrangThai: 0
    })
    const [phong, setPhong] = useState();

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(url + "/api/phong/"+maPhong, data,
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                toast.success("Cập nhật phòng thành công");
                setErrorMessage("");
                setData({
                    maPhong: response.data.result.maPhong,
                    tang: response.data.result.tang,
                    moTa: response.data.result.moTa,
                    idHangPhong: response.data.result.idHangPhong,
                    idTrangThai: response.data.result.idTrangThai
                })
            } else {
                toast.error("Lỗi cập nhật phòng");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật phòng");
            setErrorMessage(error.response.data.message);
        }
    }

    const getHangPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/hang-phong/all",
                { headers: { Authorization: `Bearer ${token}` } });
            setHangPhongs(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const getTrangThais = async () => {
        try {
            const response = await axios.get(url + "/api/trang-thai/all",
                { headers: { Authorization: `Bearer ${token}` } });
            setTrangThais(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const getPhongTheoId = async () => {
        try {
            const response = await axios.get(url + "/api/phong/" + maPhong,
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setPhong(response.data);
                setData({
                    maPhong: response.data.result.maPhong,
                    tang: response.data.result.tang,
                    moTa: response.data.result.moTa,
                    idHangPhong: response.data.result.idHangPhong,
                    idTrangThai: response.data.result.idTrangThai
                })
                setErrorMessage("");
            } else {
                toast.error(response.data.message)
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHangPhongs();
            getTrangThais();
            if (maPhong) {
                getPhongTheoId();
            }
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='them-phong'>
                        <div className="them-phong-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Cập nhật phòng</h3>
                                </div>
                                <form onSubmit={onSubmitHandler}>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="mb-3">
                                        <label htmlFor="maPhong" className="form-label">Mã phòng</label>
                                        <input onChange={onChangeHandle} name='maPhong' value={data.maPhong} type="text" className="form-control" id="maPhong" placeholder="Nhập mã phòng" required disabled/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputTang" className="form-label">Vị trí tầng</label>
                                        <input onChange={onChangeHandle} name='tang' value={data.tang} type="number" className="form-control" id="exampleFormControlInputTang" placeholder="Nhập vị trí tầng" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextareaMoTa" className="form-label">Nhập mô tả</label>
                                        <textarea onChange={onChangeHandle} name='moTa' value={data.moTa} className="form-control" id="exampleFormControlTextareaMoTa" rows="3" required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="idSelectHangPhong" className="form-label">Chọn hạng phòng</label>
                                        <select onChange={onChangeHandle} value={data.idHangPhong} name='idHangPhong' id='idSelectHangPhong' className="form-select" aria-label="Default select example">
                                            {
                                                hangPhongs.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>{item.tenHangPhong}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="idSelectTrangThai" className="form-label">Chọn trạng thái</label>
                                        <select onChange={onChangeHandle} value={data.idTrangThai} name='idTrangThai' id='idSelectTrangThai' className="form-select" aria-label="Default select example">
                                            {
                                                trangThais.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.idTrangThai}>{item.tenTrangThai}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Xác nhận</button>
                                </form>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default CapNhatPhong