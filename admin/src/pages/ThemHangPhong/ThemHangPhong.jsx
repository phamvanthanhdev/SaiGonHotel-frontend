import React, { useContext, useEffect, useState } from 'react'
import './ThemHangPhong.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemHangPhong = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [loaiPhongs, setLoaiPhongs] = useState([]);
    const [kieuPhongs, setKieuPhongs] = useState([]);
    const [loaiPhongSelected, setLoaiPhongSelected] = useState();
    const [kieuPhongSelected, setKieuPhongSelected] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        tenHangPhong: "",
        idLoaiPhong: 0,
        idKieuPhong: 0,
        moTa: "",
        giaHangPhong: 0
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
        formData.append("giaHangPhong", Number(data.giaHangPhong));
        formData.append("hinhAnh", image);
        try {
            const response = await axios.post(url + "/api/hang-phong/", formData,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.code === 200) {
                toast.success("Thêm hạng phòng thành công");
                setErrorMessage("");
                setData({
                    tenHangPhong: "",
                    idLoaiPhong: 0,
                    idKieuPhong: 0,
                    moTa: "",
                    giaHangPhong: 0
                })
                setImage(false);
                setLoaiPhongSelected();
                setKieuPhongSelected();
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
                if(response.data.result.length > 0){
                    setData(data => ({ ...data, "idLoaiPhong": response.data.result[0].idLoaiPhong }));
                    setLoaiPhongSelected(response.data.result[0]);
                }
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
                if(response.data.result.length > 0){
                    setData(data => ({ ...data, "idKieuPhong": response.data.result[0].idKieuPhong }));
                    setKieuPhongSelected(response.data.result[0]);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        if (token) {
            getLoaiPhongs();
            getKieuPhongs();
        }
    }, [token])

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='them-hang-phong'>
                        <div className="them-hang-phong-container">
                            <div className="order">
                                <div className="head">
                                    <h3>Thêm hạng phòng</h3>
                                </div>
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
                                        <select onChange={onChangeLoaiPhong} name='idLoaiPhong' id='idSelectLoaiPhong' className="form-select" aria-label="Default select example">
                                            {
                                                loaiPhongs.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.idLoaiPhong}>{item.tenLoaiPhong}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {loaiPhongSelected
                                            ? <div id="emailHelp" class="form-text">Thông tin loại phòng: Mã loại phòng: {loaiPhongSelected.idLoaiPhong}, Tên loại phòng: {loaiPhongSelected.tenLoaiPhong}, Số người: {loaiPhongSelected.soNguoiToiDa}</div>
                                            : <div id="emailHelp" class="form-text">Chưa chọn loại phòng nào</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="idSelectKieuPhong" className="form-label">Chọn kiểu phòng</label>
                                        <select onChange={onChangeKieuPhong} name='idKieuPhong' id='idSelectKieuPhong' className="form-select" aria-label="Default select example">
                                            {
                                                kieuPhongs.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.idKieuPhong}>{item.tenKieuPhong}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        {kieuPhongSelected
                                            ? <div id="emailHelp" class="form-text">Thông tin kiểu phòng: Mã kiểu phòng: {kieuPhongSelected.idKieuPhong}, Tên kiểu phòng: {kieuPhongSelected.tenKieuPhong}</div>
                                            : <div id="emailHelp" class="form-text">Chưa chọn kiểu phòng nào</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInputGiaHangPhong" className="form-label">Giá gốc cho một đêm</label>
                                        <input onChange={onChangeHandle} name='giaHangPhong' value={data.giaHangPhong} type="number" className="form-control" id="exampleFormControlInputGiaHangPhong" placeholder="Nhập giá hạng phòng" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="formFile" className="form-label">Chọn hình ảnh hạng phòng</label>
                                        <input onChange={(e) => setImage(e.target.files[0])} className="form-control" type="file" id="formFile" required />
                                        {image &&
                                            <div className="image-preview">
                                                <img src={URL.createObjectURL(image)} alt="" />
                                            </div>
                                        }
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

export default ThemHangPhong