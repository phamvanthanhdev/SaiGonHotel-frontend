import React, { useContext, useEffect, useState } from 'react'
import './List.css'
import Header from '../../components/Header/Header'
import SearchItem from '../../components/SearchItem/SearchItem'
import { DateRange } from 'react-date-range'
import { format } from "date-fns";
import { useLocation, useNavigate } from 'react-router-dom'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Search from '../../components/Search/Search'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  // const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  // const [options, setOptions] = useState(location.state.options);
  const {url, ngayNhanPhong, ngayTraPhong, setNgayNhanPhong, 
        setNgayTraPhong, cartItems, setCartItems, getTotalCartAmount, 
        hangPhong, calculateDateDifference} = useContext(StoreContext);
  const [date, setDate] = useState([
    {
      startDate: ngayNhanPhong,
      endDate: ngayTraPhong,
      key: "selection",
    },
  ]);
  const [resultSearch, setResultSearch] = useState([]);

  const navigate = useNavigate();

  const [data, setData] = useState({
    ngayDenDat: "",
    ngayDiDat: "",
    giaMin: 0,
    giaMax: 0,
    noiDung: destination,
  })

  const fetchDataSearch = async(giaMin, giaMax) => {
    if(date[0].startDate !== ngayNhanPhong || date[0].endDate !== ngayTraPhong){
      setNgayNhanPhong(date[0].startDate);
      setNgayTraPhong(date[0].endDate);
      setCartItems([]);
    }
    
    
    
    const response = await axios.get(url + "/api/thong-tin-hang-phong/tim-kiem/noi-dung", 
      {
        params: {
          ngayDenDat: format(date[0].startDate, "yyyy-MM-dd"),
          ngayDiDat: format(date[0].endDate, "yyyy-MM-dd"),
          giaMin: giaMin,
          giaMax: giaMax,
          noiDung: data.noiDung
        }
      }
    );

    setResultSearch(response.data);
  }

  useEffect(()=>{
    fetchDataSearch(0, 1000000000);
  }, [])

  const onChangeHandle = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({ ...data, [name]: value }))
  }

  const handleSearch = async() => {
    // setNgayNhanPhong(date[0].startDate);
    // setNgayTraPhong(date[0].endDate);

    fetchDataSearch(data.giaMin, data.giaMax);
    
    // setResultSearch(response.data);
  }

  const handleBooking = () => {
    navigate('/book')
  }

  return (
    <div className='list'>
      {/* <Header type="list" /> */}
      <div className="listContainer">
        <div className="listWrapper">
          <div className="list-left">
          <div className="listSearch">
            <h1 className="lsTitle">Tìm kiếm</h1>
            <div className="lsItem">
              <label>Nội dung tìm kiếm</label>
              <input onChange={onChangeHandle} name='noiDung' placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Ngày nhận phòng</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "dd/MM/yyyy"
              )} đến ${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Lựa chọn</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Giá thấp nhất <small>(mỗi đêm)</small>
                  </span>
                  <input onChange={onChangeHandle} name='giaMin' type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Giá cao nhất <small>(mỗi đêm)</small>
                  </span>
                  <input onChange={onChangeHandle} name='giaMax' type="number" className="lsOptionInput" />
                </div>
                
              </div>
            </div>
            <button onClick={()=>handleSearch()}>Tìm kiếm</button>
          </div>

          <div className="listBooking">
            <div className='title'>
              <p>Thông tin đặt phòng</p>
            </div>
            <hr />
            <div className="hotel-info">
              <p>Mường Thanh Luxury Hạ Long Centre</p>
              <p>{format(ngayNhanPhong, "dd/MM/yyyy")} - {format(ngayTraPhong, "dd/MM/yyyy")}</p>
              <p>{calculateDateDifference()} đêm</p>
            </div>
            <hr />
            <div className='list-rooms'>
              <p>Thông tin phòng</p>
              {hangPhong.map((item, index) => {
                if (cartItems[item.idHangPhong] > 0) {
                  return(
                    <div key={index} className='room'>
                      <p className='name'>Phòng: {cartItems[item.idHangPhong]} {item.tenHangPhong}</p>
                      <p className='price'>
                        {item.giaKhuyenMai
                          ? item.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                          : item.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                        } /đêm
                      </p>
                    </div>
                  )
                }
              })}
              
              <hr />
              <div className='total'>
                <p className='label'>Tổng cộng</p>
                <p className='price'>{getTotalCartAmount().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
              </div>
              <button onClick={()=>handleBooking()} className='book-btn'>Đặt ngay</button>
            </div>
            </div>


          </div>
          <div className="listResult">
            {
              resultSearch.map((item, index) => {
                return(<SearchItem
                  key={index} id={item.idHangPhong} 
                  ten = {item.tenHangPhong} soLuong = {item.soLuongTrong}
                  hinhAnh = {item.hinhAnh} tenKieuPhong = {item.tenKieuPhong} 
                  tenLoaiPhong = {item.tenLoaiPhong} giaGoc={item.giaGoc}
                  giaKhuyenMai = {item.giaKhuyenMai} phanTramGiam={item.phanTramGiam}/>)
              })
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default List