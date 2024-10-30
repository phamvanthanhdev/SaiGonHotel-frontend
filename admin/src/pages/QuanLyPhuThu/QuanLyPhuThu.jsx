import React, { useContext, useEffect, useState } from 'react'
import './QuanLyPhuThu.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ThemThayDoiGiaPhuThuPopup from '../../components/QuanLy/ThemThayDoiGiaPhuThuPopup/ThemThayDoiGiaPhuThuPopup';
import ThemPhuThuPopup from '../../components/QuanLy/ThemPhuThuPopup/ThemPhuThuPopup';

const QuanLyPhuThu = () => {
  const navigate = useNavigate();
  const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
  const [phuThus, setPhuThus] = useState([]);
  const [chiTietGiaPhuThus, setChiTietGiaPhuThus] = useState([]);
  const [showGiaPhuThus, setShowGiaPhuThus] = useState([]);
  const [isCapNhat, setIsCapNhat] = useState(false);
  const [showThemThayDoiGiaPhuThuPopup, setShowThemThayDoiGiaPhuThuPopup] = useState(false);
  const [idNhanVien, setIdNhanVien] = useState();
  const [idPhuThu, setIdPhuThu] = useState();
  const [ngayCapNhat, setNgayCapNhat] = useState();
  const [showThemPhuThuPopup, setShowThemPhuThuPopup] = useState(false);

  const getPhuThus = async () => {
    try {
      const response = await axios.get(url + "/api/phu-thu/thong-tin",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 200) {
        setPhuThus(response.data.result);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  const getChiTietGiaPhuThus = async () => {
    try {
      const response = await axios.get(url + "/api/phu-thu/chi-tiet-thay-doi-gia",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 200) {
        setChiTietGiaPhuThus(response.data.result);
        setShowGiaPhuThus(response.data.result);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      getPhuThus();
      getChiTietGiaPhuThus();
    }
  }, [token])

  const filterGiaPhuThu = (idPhuThu) => {
    setShowGiaPhuThus(chiTietGiaPhuThus.filter((gia) => gia.idPhuThu === idPhuThu));
  }

  const onOpenThemThayDoiGiaPhuThuPopup = () => {
    setIsCapNhat(false);
    setShowThemThayDoiGiaPhuThuPopup(true);
  }

  const onOpenCapNhatThayDoiGiaPhuThuPopup = (idPhuThu, idNhanVien, ngayCapNhat) => {
    setIdPhuThu(idPhuThu);
    setIdNhanVien(idNhanVien);
    setNgayCapNhat(ngayCapNhat);
    setIsCapNhat(true);
    setShowThemThayDoiGiaPhuThuPopup(true);
  }

  const onOpenThemPhuThuPopup = () => {
    setIsCapNhat(false);
    setShowThemPhuThuPopup(true);
  }

  const onOpenCapNhatPhuThuPopup = (idPhuThu) => {
    setIdPhuThu(idPhuThu);
    setIsCapNhat(true);
    setShowThemPhuThuPopup(true);
  }

  return (
    <>
      <Sidebar />
      <div className='app'>
        <section id="content" className={isExpand && 'expand'}>
          {showThemThayDoiGiaPhuThuPopup &&
            <ThemThayDoiGiaPhuThuPopup
              setShowThemThayDoiGiaPhuThuPopup={setShowThemThayDoiGiaPhuThuPopup}
              isCapNhat={isCapNhat}
              setChiTietGiaPhuThus={setChiTietGiaPhuThus}
              setShowGiaPhuThus={setShowGiaPhuThus}
              idPhuThu={idPhuThu}
              idNhanVien={idNhanVien}
              ngayCapNhat={ngayCapNhat}
              setDataPhuThus={setPhuThus}
            />
          }
          {showThemPhuThuPopup &&
            <ThemPhuThuPopup
              setShowThemPhuThuPopup={setShowThemPhuThuPopup}
              isCapNhat={isCapNhat}
              setChiTietGiaPhuThus={setChiTietGiaPhuThus}
              setShowGiaPhuThus={setShowGiaPhuThus}
              setPhuThus={setPhuThus}
              idPhuThu={idPhuThu}
            />
          }
          <Navbar />
          <main className='phu-thu'>
            <div className="phu-thu-container">
              <div className="todo">
                <div className="head">
                  <h3>Danh sách phụ thu</h3>
                  <button onClick={()=>onOpenThemPhuThuPopup()} className='btn btn-primary'>Thêm mới</button>
                </div>
                {phuThus.length > 0 ?
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Tên phụ thu</th>
                        <th>Giá hiện tại</th>
                        <th>Ngày áp dụng</th>
                        <th>Ngày cập nhật</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        phuThus.map((item, index) => {
                          return (
                            <tr onClick={() => filterGiaPhuThu(item.idPhuThu)} key={index}>
                              <td>{index + 1}.</td>
                              <td>{item.noiDung}</td>
                              <td>{item.giaCapNhat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                              <td>{convertDateShow(item.ngayApDung)}</td>
                              <td>{convertDateShow(item.ngayCapNhat)}</td>
                              <td>
                                <button onClick={()=>onOpenCapNhatPhuThuPopup(item.idPhuThu)} className='btn btn-primary'>Cập nhật</button>
                              </td>

                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  : <p className='error'>Chưa có lần thay đổi giá hạng phòng nào</p>}
              </div>

              {/* -- */}
              <div className="order">
                <div className="head">
                  <h3>Thay đổi giá phụ thu</h3>
                  <button onClick={() => onOpenThemThayDoiGiaPhuThuPopup()} className='btn btn-primary'>Thêm mới</button>
                </div>
                {showGiaPhuThus.length > 0 ?
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Tên phụ thu</th>
                        <th>Giá cập nhật</th>
                        <th>Ngày áp dụng</th>
                        <th>Ngày cập nhật</th>
                        <th>Nhân viên</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        showGiaPhuThus.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}.</td>
                              <td>{item.noiDung}</td>
                              <td>{item.giaCapNhat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                              <td>{convertDateShow(item.ngayApDung)}</td>
                              <td>{convertDateShow(item.ngayCapNhat)}</td>
                              <td>{item.tenNhanVien}</td>
                              <td><button onClick={() => onOpenCapNhatThayDoiGiaPhuThuPopup(item.idPhuThu, item.idNhanVien, item.ngayCapNhat)} className='btn btn-primary'>Cập nhật</button></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  : <p className='error'>Không có dữ liệu để hiển thị</p>}
              </div>

            </div>
          </main>
        </section>
      </div>
    </>
  )
}

export default QuanLyPhuThu