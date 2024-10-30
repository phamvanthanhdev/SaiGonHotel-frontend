import React, { useContext, useEffect, useState } from 'react'
import './TrangThaiPhongPopup.css'
import { StoreContext } from '../../context/StoreContext';
import { faXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';

const TrangThaiPhongPopup = ({maPhong, trangThaiHienTai, setShowTrangThaiPopup, setPhongSapXeps}) => {
    const { url, token } = useContext(StoreContext);
    const [idTrangThai, setIdTrangThai] = useState();
    const [trangThais, setTrangThais] = useState([]);

    const onSubmit = async (event) => {
        event.preventDefault();
        capNhatTrangThai();
    }

    const refreshPhongSapXeps = async () => {
        try {
            const response = await axios.get(url + "/api/thong-tin-phong/hien-tai/sap-xep", { headers: { Authorization: `Bearer ${token}` } });
            setPhongSapXeps(response.data.result)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhatTrangThai = async() =>{
        try {
            const config = {
                params: {idTrangThai: idTrangThai, maPhong: maPhong},
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await axios.put(url + "/api/phong/trang-thai", {}, config);
            if(response.data.code === 200){
                //refresh sơ đồ phòng
                refreshPhongSapXeps();
                setShowTrangThaiPopup(false);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const getTrangThais = async()=>{
        try {
            const response = await axios.get(url + '/api/trang-thai/all', {headers: {Authorization: `Bearer ${token}`}});
            setTrangThais(response.data);
            if(response.data.length > 0)
                setIdTrangThai(response.data[0].idTrangThai)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(token){
            getTrangThais();
        }
    }, [token])

    return (
        <div className='trang-thai-phong-popup'>
            <form onSubmit={onSubmit} action="" className="trang-thai-phong-popup-container">
                <div className="trang-thai-phong-popup-title">
                    <h2>{maPhong}</h2>
                    <FontAwesomeIcon onClick={() => setShowTrangThaiPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="trang-thai-phong-popup-inputs">
                    <label htmlFor="trangThaiHienTai">Trạng thái hiện tại: </label>
                    <input value={trangThaiHienTai} id='trangThaiHienTai' name='trangThaiHienTai' type="text" placeholder='Trạng thái hiện tại' disabled />

                    <label htmlFor="trangThaiMoi">Chọn trạng thái mới: </label>
                    <select onChange={(e)=>setIdTrangThai(e.target.value)} name="daThanhToan" id="trangThaiMoi">
                        {trangThais.map((item, index)=>{
                            return(
                                <option key={index} value={item.idTrangThai}>{item.tenTrangThai}</option>
                            )
                        })}
                        
                    </select>
                </div>
                <button type='submit'>Xác nhận</button>
            </form>
        </div>
    )
}

export default TrangThaiPhongPopup