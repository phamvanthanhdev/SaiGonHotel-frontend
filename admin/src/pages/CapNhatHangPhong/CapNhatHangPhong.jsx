import React, { useContext, useEffect, useState } from 'react'
import './CapNhatHangPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CapNhatHangPhong = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const [loaiPhongs, setLoaiPhongs] = useState([]);
    const [kieuPhongs, setKieuPhongs] = useState([]);
    const [loaiPhongSelected, setLoaiPhongSelected] = useState();
    const [kieuPhongSelected, setKieuPhongSelected] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const { id } = useParams();
    const [hangPhong, setHangPhong] = useState();

    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        tenHangPhong: "",
        idLoaiPhong: 0,
        idKieuPhong: 0,
        moTa: ""
    })

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onChangeLoaiPhong = (event) => {
        const value = event.target.value;
        setLoaiPhongSelected(loaiPhongs.find((loaiPhong) => loaiPhong.idLoaiPhong === parseInt(value)));

        setData(data => ({ ...data, "idLoaiPhong": value }));
    }

    const onChangeKieuPhong = (event) => {
        const value = event.target.value;
        setKieuPhongSelected(kieuPhongs.find((kieuPhong) => kieuPhong.idKieuPhong === parseInt(value)));

        setData(data => ({ ...data, "idKieuPhong": value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("tenHangPhong", data.tenHangPhong);
        formData.append("idLoaiPhong", data.idLoaiPhong);
        formData.append("idKieuPhong", data.idKieuPhong);
        formData.append("moTa", data.moTa);
        formData.append("hinhAnh", image);
        try {
            const response = await axios.put(url + "/api/hang-phong/" + id, formData,
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setHangPhong(response.data.result);
                setData({
                    tenHangPhong: response.data.result.tenHangPhong,
                    idLoaiPhong: response.data.result.idLoaiPhong,
                    idKieuPhong: response.data.result.idKieuPhong,
                    moTa: response.data.result.moTa,
                    hinhAnh: response.data.result.hinhAnh
                })
                setErrorMessage("");
                toast.success("Cập nhật hạng phòng thành công");
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }

    const getLoaiPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/loai-phong/all",
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setLoaiPhongs(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const getKieuPhongs = async () => {
        try {
            const response = await axios.get(url + "/api/kieu-phong/all",
                { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setKieuPhongs(response.data.result);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const getHangPhongById = async () => {
        try {
            const response = await axios.get(url + "/api/hang-phong/" + id,
                { headers: { Authorization: `Bearer ${token}` } });
            setHangPhong(response.data);
            setData({
                id: response.data.id,
                tenHangPhong: response.data.tenHangPhong,
                idLoaiPhong: response.data.idLoaiPhong,
                idKieuPhong: response.data.idKieuPhong,
                moTa: response.data.moTa,
                hinhAnh: response.data.hinhAnh
            })
            if (loaiPhongs.length > 0) {
                setLoaiPhongSelected(loaiPhongs.find((loaiPhong) => loaiPhong.idLoaiPhong === parseInt(response.data.idLoaiPhong)));
            }
            if (kieuPhongs.length > 0) {
                setKieuPhongSelected(kieuPhongs.find((kieuPhong) => kieuPhong.idKieuPhong === parseInt(response.data.idKieuPhong)));
            }
            setErrorMessage("");
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getLoaiPhongs();
            getKieuPhongs();
            getHangPhongById();
        }
    }, [token])


    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='cap-nhat-hang-phong'>
                        <div className="cap-nhat-hang-phong-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Cập nhật hạng phòng</h3>
                                </div>
                                {hangPhong ?
                                    <form onSubmit={onSubmitHandler}>
                                        {errorMessage && <p className='error'>{errorMessage}</p>}
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInputTenHangPhong" className="form-label">Tên hạng phòng</label>
                                            <input onChange={onChangeHandle} name='tenHangPhong' value={data.tenHangPhong} type="text" className="form-control" id="exampleFormControlInputTenHangPhong" placeholder="Nhập tên hạng phòng" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextareaMoTa" className="form-label">Nhập mô tả</label>
                                            <textarea onChange={onChangeHandle} name='moTa' value={data.moTa} className="form-control" id="exampleFormControlTextareaMoTa" rows="3" required></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idSelectLoaiPhong" className="form-label">Chọn loại phòng</label>
                                            <select onChange={onChangeLoaiPhong} value={data.idLoaiPhong} name='idLoaiPhong' id='idSelectLoaiPhong' className="form-select" aria-label="Default select example">
                                                {
                                                    loaiPhongs.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.idLoaiPhong}>{item.tenLoaiPhong}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {loaiPhongSelected
                                                ? <div id="emailHelp" className="form-text">Thông tin loại phòng: Mã loại phòng: {loaiPhongSelected.idLoaiPhong}, Tên loại phòng: {loaiPhongSelected.tenLoaiPhong}, Số người: {loaiPhongSelected.soNguoiToiDa}</div>
                                                : <div id="emailHelp" className="form-text">Chưa chọn loại phòng nào</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idSelectKieuPhong" className="form-label">Chọn kiểu phòng</label>
                                            <select onChange={onChangeKieuPhong} value={data.idKieuPhong} name='idKieuPhong' id='idSelectKieuPhong' className="form-select" aria-label="Default select example">
                                                {
                                                    kieuPhongs.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.idKieuPhong}>{item.tenKieuPhong}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                            {kieuPhongSelected
                                                ? <div id="emailHelp" className="form-text">Thông tin kiểu phòng: Mã kiểu phòng: {kieuPhongSelected.idKieuPhong}, Tên kiểu phòng: {kieuPhongSelected.tenKieuPhong}</div>
                                                : <div id="emailHelp" className="form-text">Chưa chọn kiểu phòng nào</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idHinhAnh" className="form-label">Hình ảnh hạng phòng</label>
                                            <div className="image-preview">
                                                {image ?
                                                    <div className="image-preview">
                                                        <img src={URL.createObjectURL(image)} alt="" />
                                                    </div>
                                                    :
                                                    <img
                                                        src={`data:image/png;base64, ${data.hinhAnh}`}
                                                        alt=""
                                                        className="siImg"
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="formFile" className="form-label">Chọn hình ảnh hạng phòng</label>
                                            <input onChange={(e) => setImage(e.target.files[0])} className="form-control" type="file" id="formFile" />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Xác nhận</button>
                                        <button type="button" className="btn btn-danger btnXoa">Xóa</button>
                                    </form>
                                    : <p>Loading...</p>}
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </>
    )
}

export default CapNhatHangPhong