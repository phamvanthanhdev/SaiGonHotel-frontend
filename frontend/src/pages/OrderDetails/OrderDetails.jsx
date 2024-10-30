import React, { useContext, useEffect, useState } from 'react'
import "./OrderDetails.css"
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import MailList from '../../components/MailList/MailList';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify'

const OrderDetails = () => {
  const id = useParams().id;

  const { url, token, convertDateShow } = useContext(StoreContext);
  const [order, setOrder] = useState();

  const fetchOrder = async () => {
    try {
      const response = await axios.get(url + `/api/phieu-dat/details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrder(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id, token])

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // onchange event
  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }

      }
      else {
        setTypeError('Vui lòng chỉ chọn loại tệp excel(xlsx, xls)');
        setExcelFile(null);
      }
    }
    else {
      console.log('Please select your file');
    }
  }

  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      // setExcelData(data.slice(0, 10));
      setExcelData(data);
    }
  }

  // const handleUpdate = () => {
  //   const dataKhachHang = excelData.map((khachHang) => ({
  //     cmnd: khachHang.CCCD,
  //     hoTen: khachHang['Họ và tên'],
  //     sdt: khachHang.SĐT,
  //     email: khachHang.Email,
  //     diaChi: khachHang['Địa chỉ']
  //   }));

  //   const formData = {
  //     idPhieuDat: id,
  //     khachHangs: dataKhachHang
  //   }

  //   sendDataKhachHang(formData);
  // }

  // const sendDataKhachHang = async (formData) => {
  //   try {
  //     const response = await axios.post(url + "/api/phieu-dat/khach-hang/cap-nhat", formData, { headers: { Authorization: `Bearer ${token}` } });
  //     if (response.data.code === 200) {
  //       toast.success("Cập nhật thông tin thành công");
  //       setSuccessMessage("Cập nhật thông tin thành công");
  //       setErrorMessage("");
  //     } else {
  //       toast.error(response.data.message);
  //       setErrorMessage(response.data.message);
  //       setSuccessMessage("");
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //     setErrorMessage(response.data.message);
  //     setSuccessMessage("");
  //   }
  // }

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }

      }
      else {
        setTypeError('Vui lòng chỉ chọn loại tệp excel(xlsx, xls)');
        setExcelFile(null);
      }
    }
    else {
      console.log('Please select your file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Vui lòng chọn file Excel để tải lên");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // Thêm file vào form data
    formData.append('idPhieuDat', id)

    try {
      const response = await axios.post(url + '/api/khach-hang/upload-excel', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',  // Đảm bảo content-type đúng
        },
      });
      console.log(response.data);
      alert("Tải file thành công!");
    } catch (error) {
      console.error("Lỗi khi tải file lên", error);
      alert("Có lỗi xảy ra khi tải file");
    }
  };


  // // Huy dat phong
  // const handleHuyDat = async () => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: {
  //       id: id
  //     }
  //   };

  //   try {
  //     const response = await axios.post(url + "/api/phieu-dat/huy-dat", null, config);
  //     if (response.data.code == 200) {
  //       toast.success("Hủy đặt phòng thành công");
  //       setOrder(prevState => ({
  //         ...prevState,
  //         trangThaiHuy: true
  //       }));
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(response.data.message);
  //   }
  // }

  // // Thanh toán sau đặt
  // const handlePaymentAfter = async () => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: {
  //       idPhieuDat: id
  //     }
  //   };

  //   try {
  //     const response = await axios.post(url + "/api/payment/create_payment/after", null, config);
  //     if (response.data.status === "OK") {
  //       window.location.href = response.data.url;
  //     } else {
  //       toast.error("Lỗi đặt phòng. Vui lòng thử lại!");
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // }

  return (
    <div>
      {order &&
        <div className="detailsContainer">
          <div className="detailsWrapper">
            <div className="detailsDetails">
              <div className="detailsDetailsTexts">
                <h1 className="detailsTitle">Chi tiết đơn đặt phòng</h1>
                <p className="detailsDesc">Mã đơn đặt phòng: {order.idPhieuDat}</p>
                <p className="detailsDesc">Ngày nhận phòng: {convertDateShow(order.ngayBatDau)}</p>
                <p className="detailsDesc">Ngày trả phòng: {convertDateShow(order.ngayTraPhong)}</p>
                <p className="detailsDesc">Đã thanh toán trước: {order.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                <p className="detailsDesc">Đại diện đặt phòng: {order.hoTen}</p>
                <p className="detailsDesc">Trạng thái:
                  {order.trangThaiHuy === 0 && <span> Đang chờ xử lý</span>}
                  {order.trangThaiHuy === 1 && <span> Đã hoàn tất</span>}
                  {order.trangThaiHuy === 2 && <span> Đã hủy</span>}
                </p>
                <p className="detailsDesc">Lưu ý tới nhân viên: {order.ghiChu}</p>
                <p className="hotelDesc">Thời gian đặt phòng: {convertDateShow(order.ngayTao)}</p>

                <div className={` ${order.trangThaiHuy !== 0 ? 'disable' : 'upload'}`}>
                  <h3>Cập nhật thông tin khách hàng</h3>
                  <form onSubmit={handleSubmit}>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                    <button type="button" onClick={handleFileSubmit}>Xem trước</button>
                    <button type="submit">Tải lên</button>
                  </form>
                  {
                    successMessage &&
                    <p className='successMessage'>{successMessage}</p>
                  }
                  {
                    errorMessage &&
                    <p className='errorMessage'>{errorMessage}</p>
                  }

                  {/* view data */}
                  <div className="viewer">
                    {excelData ? (
                      <div className="table-responsive">
                        <table className="table">

                          <thead>
                            <tr>
                              {Object.keys(excelData[0]).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {excelData.map((individualExcelData, index) => (
                              <tr key={index}>
                                {Object.keys(individualExcelData).map((key) => (
                                  <td key={key}>{individualExcelData[key]}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </div>
                    ) : (
                      <div>Chưa có tập tin nào được tải lên!</div>
                    )}
                  </div>
                </div>
              </div>




              <div className="detailsDetailsPrice">
                <h1>Danh sách phòng</h1>

                <div className='roomsContainer'>
                  {order.chiTietResponses.map((item, index) => {
                    return (
                      <div key={index} className='rooms'>
                        <img src={`data:image/png;base64, ${item.hinhAnh}`} alt="" />
                        <p>{item.soLuong} x {item.tenHangPhong}</p>
                        <p>{item.donGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                      </div>
                    )
                  })}

                </div>

                {/* <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span> */}
                <h2>
                  <b>{order.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
                </h2>
                {/* <button onClick={handlePaymentAfter} className={`paymentBtn ${order.trangThaiHuy === 2 ? 'invalid' : ''}`}>Thanh toán</button> */}
                {/* <button onClick={handleHuyDat} className={`cancelBtn ${order.trangThaiHuy === 2 ? 'invalid' : ''}`}>Hủy đơn</button> */}
              </div>
            </div>
          </div>

          <MailList />
        </div>
      }
    </div>
  );
}

export default OrderDetails