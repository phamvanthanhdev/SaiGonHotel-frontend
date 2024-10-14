import "./Hotel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import MailList from "../../components/MailList/MailList";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from 'react-toastify'
import { format } from "date-fns";

const Hotel = () => {
  const { id } = useParams();
  const { url, ngayNhanPhong, ngayTraPhong, calculateDateDifference } = useContext(StoreContext);
  const [hangPhong, setHangPhong] = useState();
  // const [slideNumber, setSlideNumber] = useState(0);
  // const [open, setOpen] = useState(false);

  const fetchHangPhongDetails = async () => {
    try {
      const response = await axios.get(url + `/api/thong-tin-hang-phong/${id}`, {
        params: {
          ngayDenDat: format(ngayNhanPhong, "yyyy-MM-dd"),
          ngayDiDat: format(ngayTraPhong, "yyyy-MM-dd")
        }
      });
      setHangPhong(response.data);
      console.log(response.data);

    } catch (error) {
      toast.error("Không tìm thấy hạng phòng.")
    }
  }

  useEffect(() => {
    fetchHangPhongDetails();
  }, [])

  const navigate = useNavigate();
  const handleClick = (destination) => {
    navigate("/hotels", { state: { destination } });
  };

  // const photos = [
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
  //   },
  // {
  //   src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707776.jpg?k=054bb3e27c9e58d3bb1110349eb5e6e24dacd53fbb0316b9e2519b2bf3c520ae&o=&hp=1",
  // },
  // {
  //   src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708693.jpg?k=ea210b4fa329fe302eab55dd9818c0571afba2abd2225ca3a36457f9afa74e94&o=&hp=1",
  // },
  // {
  //   src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707389.jpg?k=52156673f9eb6d5d99d3eed9386491a0465ce6f3b995f005ac71abc192dd5827&o=&hp=1",
  // },
  // ];

  // const handleOpen = (i) => {
  //   setSlideNumber(i);
  //   setOpen(true);
  // };

  return (
    <>
      {
        hangPhong &&
        (
          <div>
            {/* <Header type="list" /> */}
            <div className="hotelContainer">
              {/* {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )} */}
              <div className="hotelWrapper">
                <button onClick={()=>handleClick(hangPhong.tenHangPhong)} className="bookNow">Đặt phòng</button>
                <h1 className="hotelTitle">{hangPhong.tenHangPhong}</h1>
                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>97 Man Thiện, Hiệp Phú, Thủ Đức, TP Hồ Chí Minh</span>
                </div>
                <span className="hotelDistance">
                  Vị trí đắc địa – cách trung tâm 500m
                </span>
                <span className="hotelPriceHighlight">
                  Đặt phòng nghỉ bây giờ để được miễn phí taxi đưa đón sân bay
                </span>
                {/* {
            hangPhong.soLuongTrong > 0 ?
            <span className="availableNumber">
              Chỉ còn lại {hangPhong.soLuongTrong} phòng trống
            </span>
            : 
            <span className="availableNumber">
              Tạm thời hết phòng
            </span>
          } */}

                {/* <div className="hotelImages"> */}
                {/* {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))} */}

                {/* <img
                  onClick={() => handleOpen(i)}
                  src={photos[0].src}
                  alt=""
                  className="hotelImg"
                /> */}
                {/* <div className="hotelImgRight">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
            </div> */}

                {/* </div> */}
                <div className="hotelDetails">
                  <div className="hotelDetailsTexts">
                    {/* <h1 className="hotelTitle">Stay in the heart of City</h1> */}
                    <img
                      // onClick={() => handleOpen(i)}
                      src={`data:image/png;base64, ${hangPhong.hinhAnh}`}
                      alt=""
                      className="hotelImg"
                    />
                    <p className="hotelDesc">Kiểu phòng: {hangPhong.tenKieuPhong}</p>
                    <p className="hotelDesc">Loại phòng: {hangPhong.tenLoaiPhong}</p>
                    <p className="hotelDesc">Số lượng tối đa: {hangPhong.soNguoiToiDa} người</p>
                    <p className="hotelDesc-Desc">
                      {hangPhong.moTa}
                    </p>
                  </div>
                  <div className="hotelDetailsPrice">
                    <h1>Hoàn hảo cho kỳ nghỉ 1 đêm!</h1>
                    <span>
                      Tọa lạc tại trung tâm thành phố Hồ Chí Minh,
                      khách sạn này được đánh giá cao về vị trí!
                    </span>
                    <h2>
                      {
                        hangPhong.phanTramGiam > 0
                          ? <b>{hangPhong.giaKhuyenMai.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
                          : <b>{hangPhong.giaGoc.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
                      }
                      (1 đêm)
                    </h2>
                    {
                      hangPhong.phanTramGiam > 0 &&
                      <span className="siTaxOp">Tiết kiệm được 	&nbsp;
                        {(hangPhong.giaGoc - hangPhong.giaKhuyenMai).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}

                      </span>
                    }
                    <button onClick={()=>handleClick(hangPhong.tenHangPhong)}>Đặt ngay</button>
                  </div>
                </div>
              </div>

              {/* <Recommend/> */}

              <MailList />
            </div>
          </div>
        )
      }
    </>

  );
};

export default Hotel;