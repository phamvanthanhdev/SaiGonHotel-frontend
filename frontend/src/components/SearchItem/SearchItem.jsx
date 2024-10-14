import React, { useContext } from 'react'
import './SearchItem.css'
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';

const SearchItem = ({id, ten, soLuong, hinhAnh, tenKieuPhong, tenLoaiPhong, giaGoc, giaKhuyenMai, phanTramGiam}) => {
  const navigate = useNavigate();
  const {cartItems, addToCart, removeFromCart, url, calculateDateDifference} = useContext(StoreContext);

  const onChangeHandle = (e)  => {
    const quantity = parseInt(e.target.value, 10);
    if(quantity > 0){
      addToCart(id, quantity);
    }else{
      removeFromCart(id)
    }
  }

  const options = [];

  for (let i = 1; i <= soLuong; i++) {
    options.push(<option key={i} value={i}>{i} phòng (
    {phanTramGiam > 0 
    ? (giaKhuyenMai * calculateDateDifference() * i).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    : (giaGoc * calculateDateDifference() * i).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    }
    )
    </option>)
  }

  const handleClick = () => {
    navigate(`/hotels/${id}`)
  }

  return (
    <div className="searchItem">
      <img
        src={`data:image/png;base64, ${hinhAnh}`}
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{ten}</h1>
        <span className="siDistance">500m từ trung tâm</span>
        <span className="siTaxiOp">Xe đưa đón sân bay</span>
        <span className="siSubtitle">
          {tenLoaiPhong} - {tenKieuPhong}
        </span>
        <span className="siFeatures">
          WiFi miễn phí • Chỗ đỗ xe • Giặt ủi
        </span>
        <span className="siCancelOp">Miễn phí hủy phòng</span>
        {soLuong > 0 
          ? <span className="siCancelOpSubtitle">
          Chỉ còn {soLuong} phòng với mức giá này. Đặt ngay!
         </span>
         :
         <span className="siCancelOpSubtitleNotAvai">
         Tạm thời hết phòng. Vui lòng quay lại sau!
        </span>
        }
        
      </div>
      <div className="siDetails">
        <div className="siRating">
          
        </div>
        <div className="siDetailTexts">
          {
            phanTramGiam > 0 
            ? <>
                <span className="siTaxOp">Giá gốc: <del>{giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del></span> 
                <span className="siPrice">{giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
              </>
            : <span className="siPrice">{giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          }
          <span className="siTaxOp">Đã bao gồm thuế và phí</span>
          <div className='selectQuantity'>
            <select onChange={(e) => onChangeHandle(e)} name="" id="">
              <option value="0">0 phòng</option>
              {
                options
              }
            </select>
          </div>
          <button onClick={handleClick} className="siCheckButton">Xem chi tiết</button>
        </div>
      </div>
    </div>
  )
}

export default SearchItem