import React, { useContext, useEffect, useState } from 'react'
import './PhieuDatTheoNgay.css'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { format } from "date-fns";
import axios from 'axios';
import { toast } from 'react-toastify';

const PhieuDatTheoNgay = () => {
  const { url, token, setToken, isExpand, convertDateShow } = useContext(StoreContext);
  const navigate = useNavigate();
  const [dataTimKiem, setDataTimKiem] = useState({
    ngay: format(new Date(), "yyyy-MM-dd"),
    trangThai: -1
  }
  )
  const [phieuDats, setPhieuDats] = useState([]);

  const onChangeHandle = (e) => {
    const name = e.target.name;
    if (name === "ngay") {
      const value = format(e.target.value, "yyyy-MM-dd")
      setDataTimKiem(data => ({ ...data, [name]: value }))
    } else {
      const value = e.target.value;
      setDataTimKiem(data => ({ ...data, [name]: value }))
    }
  }

  const onTimKiem = async () => {
    try {
      const response = await axios.post(url + "/api/phieu-dat/ngay", dataTimKiem, { headers: { Authorization: `Bearer ${token}` } });
      setPhieuDats(response.data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      onTimKiem();
    }
  }, [token])

  const onClick = (idPhieuDat)=>{
    navigate(`/phieu-dat/${idPhieuDat}`)
  }

  return (
    <>
      <Sidebar />
      <div className='app'>
        <section id="content" className={isExpand && 'expand'}>
          <Navbar />
          <main className='phieudat-theongay'>
            <div className="table-data">
              <div className="todo">
                <div className="head">
                  <h3>Bộ lọc</h3>
                  <i className='bx bx-plus' ></i>
                  <i className='bx bx-filter' ></i>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label">Ngày nhận phòng</label>
                  <input onChange={onChangeHandle} name='ngay' type="date" className="form-control" id="exampleFormControlInput1" value={dataTimKiem.ngay} />
                </div>
                <label className="form-label">Trạng thái</label>
                <div className="form-check">
                  <input onChange={onChangeHandle} value={-1} className="form-check-input checked" type="radio" name="trangThai" id="flexRadioDefault1" defaultChecked />
                  <label className="form-check-label" htmFor="flexRadioDefault1">
                    Tất cả
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={onChangeHandle} value={0} className="form-check-input" type="radio" name="trangThai" id="flexRadioDefault2" />
                  <label className="form-check-label" htmFor="flexRadioDefault2">
                    Chờ xử lý
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={onChangeHandle} value={1} className="form-check-input" type="radio" name="trangThai" id="flexRadioDefault4" />
                  <label className="form-check-label" htmFor="flexRadioDefault4">
                    Đã hoàn tất
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={onChangeHandle} value={2} className="form-check-input" type="radio" name="trangThai" id="flexRadioDefault3" />
                  <label className="form-check-label" htmFor="flexRadioDefault3">
                    Đã hủy
                  </label>
                </div>
                <div className='button-search'>
                  <button onClick={onTimKiem} className='btn btn-primary'>Tìm kiếm</button>
                </div>
              </div>
              <div className="order">
                <div className="head">
                  <h3>Phiếu đặt theo ngày</h3>
                  <i className='bx bx-search' ></i>
                  <i className='bx bx-filter' ></i>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Thời gian</th>
                      <th>Tên khách hàng</th>
                      <th>Số điện thoại</th>
                      <th>Tạm ứng</th>
                      <th>Tổng tiền</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      phieuDats.map((item, index) => {
                        return (
                          <tr onClick={()=>onClick(item.idPhieuDat)} key={index}>
                            <td>{item.idPhieuDat}</td>
                            <td>{convertDateShow(item.ngayNhanPhong)} đến {convertDateShow(item.ngayTraPhong)}</td>
                            <td>{item.tenKhachHang}</td>
                            <td>{item.sdt}</td>
                            <td>{item.tienTamUng.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                            <td>{convertDateShow(item.ngayTao)}</td>
                            <td>
                              {item.trangThai === 0 && <span className="status process">Chờ xử lý</span>}
                              {item.trangThai === 1 && <span className="status completed">Đã hoàn tất</span>}
                              {item.trangThai === 2 && <span className="status pending">Đã hủy</span>}
                            </td>
                          </tr>
                        )
                      })
                    }


                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </section>
      </div>
    </>
  )
}

export default PhieuDatTheoNgay