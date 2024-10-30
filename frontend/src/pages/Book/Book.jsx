import React, { useContext, useState } from 'react'
import './Book.css'
import Header from '../../components/Header/Header'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { format } from "date-fns";
import { toast } from 'react-toastify'

const Book = () => {
    const { url, hangPhong, cartItems, setCartItems, getTotalCartAmount, ngayNhanPhong, ngayTraPhong, calculateDateDifference } = useContext(StoreContext);
    const [dataKhachHang, setDataKhachHang] = useState({
        idKhachHang: 0,
        cmnd: "",
        diaChi: "",
        email: "",
        hoTen: "",
        sdt: "",
        ghiChu: "",
    })
    const [isDisabled, setIsDisabled] = useState(true);
    const [typePayment, setTypePayment] = useState("pay-after");
    const [tienTamUng, setTienTamUng] = useState(getTotalCartAmount() * 10 / 100);
    const [dataDatPhong, setDataDatPhong] = useState({
        "ngayBatDau": format(ngayNhanPhong, "yyyy-MM-dd"),
        "ngayTraPhong": format(ngayTraPhong, "yyyy-MM-dd"),
        "ghiChu": null,
        "ngayTao": format(new Date(), "yyyy-MM-dd"),
        "idKhachHang": null,
        "idNhanVien": null,
        "tienTamUng": 0,
        chiTietRequests: []
    })
    const [errorMessage, setErrorMessage] = useState("");
    const [cccd, setCccd] = useState();

    const handleCheckboxChange = (e) => {
        setTypePayment(e.target.value);
        if (e.target.value === 'pay-some') {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name === 'cmnd')
            setCccd(value);
        setDataKhachHang(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault();

        if (typePayment === "pay-all") {
            dataDatPhong.tienTamUng = getTotalCartAmount();
        } else if (typePayment === "pay-some") {
            dataDatPhong.tienTamUng = tienTamUng;
        } else {
            dataDatPhong.tienTamUng = 0;
        }

        const chiTietRequests = Object.entries(cartItems).map(([idHangPhong, soLuong]) => ({
            idHangPhong: parseInt(idHangPhong),
            soLuong: soLuong
        }));
        dataDatPhong.chiTietRequests = chiTietRequests;
        dataDatPhong.ghiChu = dataKhachHang.ghiChu;


        const formData = {
            khachHang: dataKhachHang,
            phieuDat: dataDatPhong
        }

        if (typePayment === "pay-after") {
            datPhongKhachSan(formData);
        } else {
            datPhongKhachSanPayment(formData);
        }
    }



    const datPhongKhachSanPayment = async (formData) => {
        try {
            const response = await axios.post(url + "/api/payment/create_payment", formData);
            if (response.data.status === "OK") {
                setCartItems([]);
                window.location.href = response.data.url;
            }
            console.log(response);

        } catch (error) {
            console.log(error.message);
            toast.error("Lỗi đặt phòng. Vui lòng thử lại!");
        }
    }

    const datPhongKhachSan = async (formData) => {
        try {
            const response = await axios.post(url + "/api/phieu-dat/dat-phong", formData)
            if (response.data.code === 200) {
                setCartItems([]);
                toast.success(response.data.message);
            } else {
                toast.error("Lỗi đặt phòng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Lỗi đặt phòng. Vui lòng thử lại!");
        }
    }

    const findUserByCmnd = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(url + "/api/khach-hang/tim-kiem-cccd", { params: { cccd: dataKhachHang.cmnd } });
            if (response.data.code === 200) {
                setDataKhachHang(response.data.result);
                setErrorMessage("");
            } else {
                setDataKhachHang({
                    idKhachHang: 0,
                    cmnd: "",
                    diaChi: "",
                    email: "",
                    hoTen: "",
                    sdt: "",
                    ghiChu: "",
                })
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setDataKhachHang({
                idKhachHang: 0,
                cmnd: "",
                diaChi: "",
                email: "",
                hoTen: "",
                sdt: "",
                ghiChu: "",
            })
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }

        // axios.get(url + "/api/khach-hang/tim-kiem-cccd", {params : {cccd: dataKhachHang.cmnd}})
        // .then(response => {
        //     return response.data
        // })
        // .then(data => {
        //     console.log(data)
        //     setDataKhachHang(data)
        // })
        // .catch(error => {
        //     console.log(error.response.data.error)
        // })
    }

    return (
        <div className='book'>
            {/* <Header type="list" /> */}
            <div className="bookContainer">
                <div className="bookWrapper">
                    <div className="book-list">
                        <div className='title'>
                            <p>Chi tiết đặt phòng của bạn</p>
                        </div>
                        <div className="time">
                            <p>Nhận phòng</p>
                            <span>{format(ngayNhanPhong, "dd/MM/yyyy")}</span>
                            <p>Trả phòng</p>
                            <span>{format(ngayTraPhong, "dd/MM/yyyy")}</span>
                        </div>
                        <div className='night'>
                            <p>Tổng thời gian lưu trú:</p>
                            <h4>{calculateDateDifference()} đêm</h4>
                        </div>
                        <hr />
                        <div className='rooms'>
                            <div className='titleRoom'>
                                <p>Bạn đã chọn</p>
                            </div>
                            <div className='listRooms'>
                                {
                                    hangPhong.map((item, index) => {
                                        if (cartItems[item.idHangPhong] > 0) {
                                            return (
                                                <p key={index}>{cartItems[item.idHangPhong]} x {item.tenHangPhong}</p>
                                            )
                                        }
                                    })
                                }
                            </div>
                            <a href="#">Đổi lựa chọn của bạn</a>
                        </div>
                        <hr />
                        <div className='totalPrice'>
                            <p>GIÁ</p>
                            <p>{getTotalCartAmount().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                        </div>
                    </div>

                    <div className="book-info">
                        <div className='formContainer'>
                            <h3 className="title">Nhập thông tin chi tiết của bạn</h3>
                            <form onSubmit={(e) => placeOrder(e)} className='form'>

                                {errorMessage &&
                                    <div className="column">
                                        <p className='error'>{errorMessage}</p>
                                    </div>
                                }
                                <div className="column">
                                    <div className="input-box">
                                        <label>CMND/CCCD<span>*</span></label>
                                        <input onChange={(e) => onChangeHandle(e)} name='cmnd' value={cccd} type="number" placeholder='Nhập số CCCD/CMND' required />
                                    </div>
                                    <button onClick={(e) => findUserByCmnd(e)} className='search-user-btn'>Tìm kiếm</button>

                                </div>
                                <div className="input-box">
                                    <label>Họ tên<span>*</span></label>
                                    <input onChange={(e) => onChangeHandle(e)} name='hoTen' value={dataKhachHang.hoTen} type="text" placeholder='Nhập họ tên' required />
                                </div>
                                <div className="column">
                                    <div className="input-box">
                                        <label>Email<span>*</span></label>
                                        <input onChange={(e) => onChangeHandle(e)} name='email' value={dataKhachHang.email} type="email" placeholder='Nhập email' required />
                                    </div>

                                    <div className="input-box">
                                        <label>Số điện thoại<span>*</span></label>
                                        <input onChange={(e) => onChangeHandle(e)} name='sdt' value={dataKhachHang.sdt} type="number" placeholder='Nhập số điện thoại' required />
                                    </div>
                                </div>
                                <div className="input-box">
                                    <label>Địa chỉ<span>*</span></label>
                                    <input onChange={(e) => onChangeHandle(e)} name='diaChi' value={dataKhachHang.diaChi} type="text" placeholder='Nhập địa chỉ' required />
                                </div>

                                <div className="input-checkbox">
                                    <input
                                        // checked
                                        onChange={handleCheckboxChange}
                                        id="payAfter"
                                        type="radio" name="pay" value="pay-after" required />
                                    <label htmlFor="payAfter"> Thanh toán khi nhận phòng</label>
                                </div>

                                <div className="input-checkbox">
                                    <input
                                        // checked={isDisabled} 
                                        onChange={handleCheckboxChange}
                                        id="payAll"
                                        type="radio" name="pay" value="pay-all" required />
                                    <label htmlFor="payAll"> Thanh toán toàn bộ</label>
                                </div>

                                <div className="input-checkbox">
                                    <input
                                        // checked={isDisabled} 
                                        onChange={handleCheckboxChange}
                                        id="paySome"
                                        type="radio" name="pay" value="pay-some" required />
                                    <label htmlFor="paySome"> Thanh toán một phần</label>
                                </div>

                                <div className="input-box">
                                    <label>Tạm ứng trước <small>(Lớn hơn 10% giá trị đơn hàng)</small></label>
                                    <input disabled={isDisabled}
                                        style={{ backgroundColor: isDisabled ? '#e0e0e0' : 'white' }}
                                        value={tienTamUng}
                                        onChange={(e) => setTienTamUng(e.target.value)}
                                        min={getTotalCartAmount() * 10 / 100}
                                        type="number" placeholder='Nhập số tiền trả trước' required />
                                </div>

                                <div className="input-box">
                                    <label>Lưu ý cho nhân viên</label>
                                    <textarea onChange={(e) => onChangeHandle(e)} name='ghiChu' value={dataKhachHang.ghiChu} type="text" placeholder='Nhập lưu ý' required />
                                </div>
                                <button type='submit' className='bookBtn'>Bước tiếp theo</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Book