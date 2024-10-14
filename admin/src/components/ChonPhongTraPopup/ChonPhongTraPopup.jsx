import React, { useContext, useEffect, useState } from 'react'
import './ChonPhongTraPopup.css'
import { StoreContext } from '../../context/StoreContext';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChonPhongTraPopup = ({ idPhieuThue, setShowPhongTraPopup }) => {
  const navigate = useNavigate();
  const { url, token, setToken } = useContext(StoreContext);
  const [chiTietPhieuThues, setChiTietPhieuThues] = useState([]);
  const [idChiTietPhieuThues, setIdChiTietPhieuThues] = useState([]);

  const [data, setData] = useState({
    idPhieuThue: idPhieuThue,
    idChiTietPhieuThues:[]
  })

  const onChangeHandler = (e, idChiTietPhieuThue) => {
    if(e.target.checked){
      let newArray = data.idChiTietPhieuThues.slice();    
      newArray.push(idChiTietPhieuThue);   
      setData({ ...data, idChiTietPhieuThues:newArray})
    }else{
      let filteredArray = data.idChiTietPhieuThues.filter(item => item !== idChiTietPhieuThue)
      setData({ ...data, idChiTietPhieuThues:filteredArray});
    }
    
    // const name = event.target.name;
    // const value = event.target.value;
    // setData(data => ({ ...data, [name]: value }))
  }

  const onClick = async () => {
    console.log(data);
    navigate("/tra-phong", {state: {phongTra: data}})
  }

  const fetchChiTietPhieuThues = async () => {
    try {
      const response = await axios.get(url + `/api/chi-tiet/phieu-thue/${idPhieuThue}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setChiTietPhieuThues(response.data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchChiTietPhieuThues();
  }, [])

  return (
    <div className='chon-phongtra-popup'>
      <div className="chon-phongtra-popup-container">
        <div className="chon-phongtra-popup-title">
          <h2>Chọn phòng trả</h2>
          <FontAwesomeIcon onClick={() => setShowPhongTraPopup(false)} className="close" icon={faXmark} />
        </div>
        <div className="chon-phongtra-popup-inputs">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked /></th>
                <th>Hạng phòng</th>
                <th>Phòng</th>
                <th>Ngày nhận phòng</th>
                <th>Ngày trả phòng</th>
                <th>Tiền phòng</th>
              </tr>
            </thead>
            <tbody>
              {chiTietPhieuThues.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {!item.daThanhToan 
                      ? <input onChange={(e)=>onChangeHandler(e, item.idChiTietPhieuThue)} type="checkbox" id="vehicle1" name="vehicle1" value="check" />
                      : <></>}
                    </td>
                    <td>{item.tenHangPhong}</td>
                    <td>{item.maPhong}</td>
                    <td>{item.ngayDen}</td>
                    <td>{item.ngayDi}</td>
                    <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  </tr>
                )
              })}


            </tbody>
          </table>
        </div>
        <button onClick={onClick} type='button'>Xác nhận</button>
      </div>
    </div>
  )
}

export default ChonPhongTraPopup