import React, { useContext } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  const { url, token, setToken } = useContext(StoreContext);

  const downloadExcelFile = () => {
    axios({
      url: url + '/api/khach-hang/download', // Thay bằng URL API tạo file Excel của bạn
      method: 'GET',
      responseType: 'blob', // Để nhận file dưới dạng blob
    })
      .then((response) => {
        // Tạo URL từ dữ liệu blob nhận được
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Tên file khi tải xuống
        link.setAttribute('download', 'saigon-hotel.xlsx');

        // Thêm vào DOM và click tự động để tải file
        document.body.appendChild(link);
        link.click();

        // Sau đó xóa link để dọn dẹp
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading the file', error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <a href='/'><span className="logo">SaiGon Hotel</span></a>
        <div className="navItems">
          <button onClick={() => navigate("/")} className="navButton">Trang chủ</button>
          <button onClick={() => navigate("/cart")} className="navButton">Giỏ hàng</button>

          <div className="tooltip"><button onClick={downloadExcelFile} className="navButton">Download</button>
            <span className="tooltiptext">Mẫu đơn danh sách khách hàng sẽ nhận phòng</span>
          </div>

          {/* <button onClick={() => setShowLogin(true)} className="navButton">Register</button> */}

          {!token
            ? <button onClick={() => setShowLogin(true)} className="navButton">Login</button>
            : <div className="dropdown">
              <span><FontAwesomeIcon icon={faUser} /></span>
              <div className="dropdown-content">
                <p onClick={() => navigate("/my-orders")}>Phiếu đặt</p>
                <hr />
                <p onClick={logout}>Đăng xuất</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar