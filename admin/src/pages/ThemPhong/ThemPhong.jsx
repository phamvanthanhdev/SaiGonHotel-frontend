import React, { useContext, useEffect, useState } from 'react'
import './ThemPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemPhong = () => {
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

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(url + "/api/phong/", data,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Thêm phòng thành công");
                setErrorMessage("");
                setData({
                    maPhong: "",
                    tang: 0,
                    moTa: "",
                    idHangPhong: 0,
                    idTrangThai: 0
                })
            } else {
                toast.error("Lỗi thêm phòng");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi thêm phòng");
            setErrorMessage(error.response.data.message);
        }
    }

    const getHangPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/hang-phong/all",
                { headers: { Authorization: `Bearer ${token}` } });
            setHangPhongs(response.data);
            if (response.data.length > 0) {
                setData(data => ({ ...data, "idHangPhong": response.data[0].id }));
            }
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
            if (response.data.length > 0) {
                setData(data => ({ ...data, "idTrangThai": response.data[0].idTrangThai }));
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            getHangPhongs();
            getTrangThais();
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
                                    <h3>Thêm phòng mới</h3>
                                </div>
                                <form onSubmit={onSubmitHandler}>
                                    {errorMessage && <p className='error'>{errorMessage}</p>}
                                    <div className="mb-3">
                                        <label htmlFor="maPhong" className="form-label">Mã phòng</label>
                                        <input onChange={onChangeHandle} name='maPhong' value={data.maPhong} type="text" className="form-control" id="maPhong" placeholder="Nhập mã phòng" required />
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
                                        <select onChange={onChangeHandle} name='idHangPhong' id='idSelectHangPhong' className="form-select" aria-label="Default select example">
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
                                        <select onChange={onChangeHandle} name='idTrangThai' id='idSelectTrangThai' className="form-select" aria-label="Default select example">
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

export default ThemPhong