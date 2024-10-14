import React, { useContext, useEffect } from 'react'
import './ResultPayment.css'
import MailList from '../../components/MailList/MailList'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import {toast} from 'react-toastify'

const ResultPayment = () => {
  const { url } = useContext(StoreContext);
  const query = new URLSearchParams(useLocation().search);

  const vnp_Amount = parseInt(query.get('vnp_Amount')) / 100;
  const vnp_ResponseCode = query.get('vnp_ResponseCode');
  const vnp_TxnRef = query.get('vnp_TxnRef');
  const vnp_PayDate = query.get('vnp_PayDate');

  // Tách chuỗi ra các phần
  const year = vnp_PayDate.substring(0, 4);
  const month = vnp_PayDate.substring(4, 6);
  const day = vnp_PayDate.substring(6, 8);
  const hour = vnp_PayDate.substring(8, 10);
  const minute = vnp_PayDate.substring(10, 12);
  const second = vnp_PayDate.substring(12, 14);

  // Tạo đối tượng Date (lưu ý: tháng trong JavaScript bắt đầu từ 0, nên cần trừ đi 1)
  const date = new Date(year, month - 1, day, hour, minute, second);

  // Định dạng ngày tháng theo dạng dễ đọc (dd/MM/yyyy HH:mm:ss)
  const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

  const handlePayment = async () => {
    const response = await axios.get(url + "/api/payment/payment-update",
      {params: {
          vnp_Amount: vnp_Amount,
          vnp_ResponseCode: vnp_ResponseCode,
          vnp_TxnRef: vnp_TxnRef,
          vnp_PayDate: vnp_PayDate
      }});
    
    if(response.data.status === "OK"){
      toast.success("Thanh toán đơn hàng thành công");
    }else{
      toast.error("Thanh toán không thành công");
    }
  }

  useEffect(()=>{
    handlePayment();
  }, [])

  return (
    <div className="resultPaymentContainer">
      <div className="resultPaymentWrapper">

        <div className="resultPaymentDetails">
          <div className="resultPaymentDetailsTexts">
            <h1 className="resultPaymentTitle">Kết quả giao dịch</h1>
            <p className="resultPaymentDesc">Trạng thái: {vnp_ResponseCode === "00" ? "Thành công" : "Thất bại"}</p>
            <p className="resultPaymentDesc">Số tiền đã thanh toán: {vnp_Amount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            <p className="resultPaymentDesc">Mã đơn hàng: {vnp_TxnRef}</p>
            <p className="resultPaymentDesc">Thời gian giao dịch: {formattedDate}</p>
          </div>
          <div className="resultPaymentDetailsPrice">
            <h1>Đặt phòng thành công!</h1>
            <span>
              Vui lòng kiểm tra email để xem thông tin đơn đặt phòng đã đặt,
              hoặc đăng ký tài khoản để xem danh sách đơn đặt phòng của bạn!
            </span>
            <h2>
              <b>{vnp_Amount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
            </h2>
            <button>Danh sách đơn hàng!</button>
          </div>
        </div>
      </div>

      <MailList />
    </div>
  )
}

export default ResultPayment