import React from 'react'
import './OrderItem.css'
import { useNavigate } from 'react-router-dom'

const OrderItem = ({id, ngayBatDau, ngayTraPhong, ghiChu, tienTamUng, idNhanVien, trangThaiHuy, tongTien}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/order-details/${id}`)
  }


  return (
    <div className="orderItem">
      <img
        src="https://cf.bstatic.com/xdata/images/hotel/square600/261707778.webp?k=fa6b6128468ec15e81f7d076b6f2473fa3a80c255582f155cae35f9edbffdd78&o=&s=1"
        alt=""
        className="oiImg"
      />
      <div className="oiDesc">
        <h1 className="oiTitle">SAIGON HOTEL</h1>
        <span className="oiDistance">{ngayBatDau} đến {ngayTraPhong}</span>
        <span className="oiFeatures">
          Mã đặt phòng: {id}
        </span>
        {trangThaiHuy === 0 && <span className="oiTaxiOp">Đang chờ xử lý</span>}
        {trangThaiHuy === 1 && <span className="oiTaxiOp success">Đã hoàn tất</span>}
        {trangThaiHuy === 2 && <span className="oiTaxiOp canceled">Đã hủy</span>}
        {/* <span className="oiSubtitle">
          Miễn phí hủy phòng
        </span> */}
        <span className="oiCancelOp">Miễn phí hủy phòng </span>
        <span className="oiCancelOpSubtitle">
        Bãi đậu xe • Wifi miễn phí • Máy lạnh
        </span>
      </div>
      <div className="oiDetails">
        <div className="oiRating">
          {/* <span>Excellent</span>
          <button>8.9</button> */}
        </div>
        <div className="oiDetailTexts">
          <span className="oiPrice">{tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          <span className="oiTaxOp">Bao gồm tất cả thuế và phí</span>
          
          <button onClick={handleClick} className={`oiCheckButton ${trangThaiHuy ? 'btnCancel' : ''}`}>Chi tiết đặt phòng</button>
        </div>
      </div>
    </div>
  )
}

export default OrderItem