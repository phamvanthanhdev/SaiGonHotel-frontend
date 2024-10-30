import React, { useContext, useEffect, useState } from 'react'
import './FeaturedBestSeller.css'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { format } from "date-fns";

const FeaturedBestSeller = () => {
  const { url, ngayNhanPhong, ngayTraPhong} = useContext(StoreContext)
  const [ hangPhongDatThue, setHangPhongDatThue ] = useState([]);
  const navigate = useNavigate();

  const fetchHangPhongDatThue = async () => {
    const ngayNhanPhongFormat = format(ngayNhanPhong, "yyyy-MM-dd");
    const ngayTraPhongFormat = format(ngayTraPhong, "yyyy-MM-dd");

    const response = await axios.get(url + "/api/thong-tin-hang-phong/dat-thue", {
      params: {
        ngayDenDat: ngayNhanPhongFormat,
        ngayDiDat: ngayTraPhongFormat
      }
    });
    setHangPhongDatThue(response.data)
  }

  useEffect(() => {
    fetchHangPhongDatThue();
  }, [])

  const handleClick = (id) => {
    navigate(`/hotels/${id}`)
  }

  return (
    <div className="fpBest">
      {hangPhongDatThue.map((item, index) => {
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
              {item.phanTramGiam > 0
                ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
              }
              &nbsp;
              {item.phanTramGiam > 0 &&
                <del>{item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>
              }
            </span>

            <div className="fpRating">
              <span>Còn lại {item.soLuongTrong} phòng</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FeaturedBestSeller