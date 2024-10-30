import React, { useContext, useEffect, useState } from 'react'
import './QuanLyDichVu.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ThemThayDoiGiaDichVuPopup from '../../components/QuanLy/ThemThayDoiGiaDichVuPopup/ThemThayDoiGiaDichVuPopup';
import ThemDichVuPopup from '../../components/QuanLy/ThemDichVuPopup/ThemDichVuPopup';

const QuanLyDichVu = () => {
  const navigate = useNavigate();
  const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
  const [dichVus, setDichVus] = useState([]);
  const [chiTietGiaDichVus, setChiTietGiaDichVus] = useState([]);
  const [showGiaDichVus, setShowGiaDichVus] = useState([]);
  const [isCapNhat, setIsCapNhat] = useState(false);
  const [showThemThayDoiGiaDichVuPopup, setShowThemThayDoiGiaDichVuPopup] = useState(false);
  const [idNhanVien, setIdNhanVien] = useState();
  const [idDichVu, setIdDichVu] = useState();
  const [ngayCapNhat, setNgayCapNhat] = useState();
  const [showThemDichVuPopup, setShowThemDichVuPopup] = useState(false);

  const getDichVus = async () => {
    try {
      const response = await axios.get(url + "/api/dich-vu/thong-tin",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 200) {
        setDichVus(response.data.result);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  const getChiTietGiaDichVus = async () => {
    try {
      const response = await axios.get(url + "/api/dich-vu/chi-tiet-thay-doi-gia",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code === 200) {
        setChiTietGiaDichVus(response.data.result);
        setShowGiaDichVus(response.data.result);
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
      getDichVus();
      getChiTietGiaDichVus();
    }
  }, [token])

  const filterGiaDichVu = (idDichVu) => {
    setShowGiaDichVus(chiTietGiaDichVus.filter((gia) => gia.idDichVu === idDichVu));
  }

  const onOpenThemThayDoiGiaDichVuPopup = () => {
    setIsCapNhat(false);
    setShowThemThayDoiGiaDichVuPopup(true);
  }

  const onOpenCapNhatThayDoiGiaDichVuPopup = (idDichVu, idNhanVien, ngayCapNhat) => {
    setIdDichVu(idDichVu);
    setIdNhanVien(idNhanVien);
    setNgayCapNhat(ngayCapNhat);
    setIsCapNhat(true);
    setShowThemThayDoiGiaDichVuPopup(true);
  }

  const onOpenThemDichVuPopup = () => {
    setIsCapNhat(false);
    setShowThemDichVuPopup(true);
  }

  const onOpenCapNhatDichVuPopup = (idDichVu) => {
    setIdDichVu(idDichVu);
    setIsCapNhat(true);
    setShowThemDichVuPopup(true);
  }

  return (
    <>
      <Sidebar />
      <div className='app'>
        <section id="content" className={isExpand && 'expand'}>
          {showThemThayDoiGiaDichVuPopup &&
            <ThemThayDoiGiaDichVuPopup
              setShowThemThayDoiGiaDichVuPopup={setShowThemThayDoiGiaDichVuPopup}
              isCapNhat={isCapNhat}
              setChiTietGiaDichVus={setChiTietGiaDichVus}
              setShowGiaDichVus={setShowGiaDichVus}
              idDichVu={idDichVu}
              idNhanVien={idNhanVien}
              ngayCapNhat={ngayCapNhat}
              setDataDichVus={setDichVus}
            />
          }

          {showThemDichVuPopup &&
            <ThemDichVuPopup
              setShowThemDichVuPopup={setShowThemDichVuPopup}
              isCapNhat={isCapNhat}
              setChiTietGiaDichVus={setChiTietGiaDichVus}
              setShowGiaDichVus={setShowGiaDichVus}
              setDichVus={setDichVus}
              idDichVu={idDichVu}
            />
          }

          <Navbar />
          <main className='dich-vu'>
            <div className="dich-vu-container">
              <div className="todo">
                <div className="head">
                  <h3>Danh sách dịch vụ</h3>
                  <button onClick={()=>onOpenThemDichVuPopup()} className='btn btn-primary'>Thêm mới</button>
                </div>
                {dichVus.length > 0 ?
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Tên dịch vụ</th>
                        <th>Giá hiện tại</th>
                        <th>Ngày áp dụng</th>
                        <th>Ngày cập nhật</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        dichVus.map((item, index) => {
                          return (
                            <tr onClick={() => filterGiaDichVu(item.idDichVu)} key={index}>
                              <td>{index + 1}.</td>
                              <td>{item.tenDichVu}</td>
                              <td>{item.giaCapNhat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                              <td>{convertDateShow(item.ngayApDung)}</td>
                              <td>{convertDateShow(item.ngayCapNhat)}</td>
                              <td><button onClick={()=>onOpenCapNhatDichVuPopup(item.idDichVu)} className='btn btn-primary'>Cập nhật</button></td>
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
                  <h3>Thay đổi giá dịch vụ</h3>
                  <button onClick={()=>onOpenThemThayDoiGiaDichVuPopup()} className='btn btn-primary'>Thêm mới</button>
                </div>
                {showGiaDichVus.length > 0 ?
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Tên dịch vụ</th>
                        <th>Giá cập nhật</th>
                        <th>Ngày áp dụng</th>
                        <th>Ngày cập nhật</th>
                        <th>Nhân viên</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        showGiaDichVus.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}.</td>
                              <td>{item.tenDichVu}</td>
                              <td>{item.giaCapNhat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                              <td>{convertDateShow(item.ngayApDung)}</td>
                              <td>{convertDateShow(item.ngayCapNhat)}</td>
                              <td>{item.tenNhanVien}</td>
                              <td><button onClick={()=>onOpenCapNhatThayDoiGiaDichVuPopup(item.idDichVu, item.idNhanVien, item.ngayCapNhat)} className='btn btn-primary'>Cập nhật</button></td>
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

export default QuanLyDichVu