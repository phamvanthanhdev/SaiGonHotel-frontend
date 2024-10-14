import React, { useContext, useEffect, useState } from 'react'
import './FeaturedProperties.css'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { format } from "date-fns";

const FeaturedProperties = () => {
  const { url, ngayNhanPhong, ngayTraPhong} = useContext(StoreContext)
  const [ hangPhongGiamGia, setHangPhongGiamGia ] = useState([]);
  const navigate = useNavigate();

  const fetchHangPhongGiamGia = async () => {
    const ngayNhanPhongFormat = format(ngayNhanPhong, "yyyy-MM-dd");
    const ngayTraPhongFormat = format(ngayTraPhong, "yyyy-MM-dd");

    const response = await axios.get(url + "/api/thong-tin-hang-phong/giam-gia", {
      params: {
        ngayDenDat: ngayNhanPhongFormat,
        ngayDiDat: ngayTraPhongFormat
      }
    });
    setHangPhongGiamGia(response.data)
  }

  useEffect(() => {
    fetchHangPhongGiamGia();
  }, [])

  const handleClick = (id) => {
    navigate(`/hotels/${id}`)
  }

  return (
    <div className="fp">
      {hangPhongGiamGia.map((item, index) => {
        return (
          <div key={index} onClick={() => handleClick(item.idHangPhong)} className="fpItem">
            <img
              src={`data:image/png;base64, ${item.hinhAnh}`}
              alt="Room Photo"
              className="fpImg"
            />
            <span className="fpName">{item.tenHangPhong}</span>
            <span className="fpCity">{item.tenKieuPhong}</span>
            <span className="fpPrice">
              {item.giaKhuyenMai
                ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
              }
              &nbsp;
              {item.giaKhuyenMai !== 0 &&
                <del>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>
              }
            </span>

            <div className="fpRating">
              <span>Còn lại {item.soLuongTrong} phòng</span>
            </div>
          </div>
        )
      })}
      {/* <div onClick={() => handleClick(1)} className="fpItem">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
          alt=""
          className="fpImg"
        />
        <span className="fpName">Aparthotel Stare Miasto</span>
        <span className="fpCity">Madrid</span>
        <span className="fpPrice">Starting from $120</span>
        <div className="fpRating">
          <button>8.9</button>
          <span>Excellent</span>
        </div>
      </div>
      <div onClick={() => handleClick(1)} className="fpItem">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
          alt=""
          className="fpImg"
        />
        <span className="fpName">Comfort Suites Airport</span>
        <span className="fpCity">Austin</span>
        <span className="fpPrice">Starting from $140</span>
        <div className="fpRating">
          <button>9.3</button>
          <span>Exceptional</span>
        </div>
      </div>
      <div onClick={() => handleClick(1)} className="fpItem">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
          alt=""
          className="fpImg"
        />
        <span className="fpName">Four Seasons Hotel</span>
        <span className="fpCity">Lisbon</span>
        <span className="fpPrice">Starting from $99</span>
        <div className="fpRating">
          <button>8.8</button>
          <span>Excellent</span>
        </div>
      </div>
      <div onClick={() => handleClick(1)} className="fpItem">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
          alt=""
          className="fpImg"
        />
        <span className="fpName">Hilton Garden Inn</span>
        <span className="fpCity">Berlin</span>
        <span className="fpPrice">Starting from $105</span>
        <div className="fpRating">
          <button>8.9</button>
          <span>Excellent</span>
        </div>
      </div> */}
    </div>
  )
}

export default FeaturedProperties