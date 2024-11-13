import React, { useContext, useEffect, useState } from 'react'
import './ThemNhomQuyenPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';

const ThemNhomQuyenPopup = ({ setShowThemNhomQuyenPopup, isCapNhat, setNhomQuyens, idNhomQuyen }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        tenNhomQuyen: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (token) {
            if (isCapNhat) {
                getNhomQuyenTheoId();
            }
        }
    }, [token])

    const ThemNhomQuyen = async () => {
        try {
            const response = await axios.post(url + "/api/nhom-quyen/", data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if(response.data.code){
                refreshNhomQuyens();
                setErrorMessage("");
                setShowThemNhomQuyenPopup(false);
                toast.success("Thêm nhóm quyền thành công");
            }
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    const refreshNhomQuyens = async () => {
        try {
            const response = await axios.get(url + `/api/nhom-quyen/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setNhomQuyens(response.data.result);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapNhomQuyen = async () => {
        if (idNhomQuyen) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/nhom-quyen/" + idNhomQuyen, data, config);
                
                refreshNhomQuyens();
                setErrorMessage("");
                setShowThemNhomQuyenPopup(false);
                toast.success("Cập nhật nhóm quyền thành công");
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const xoaNhomQuyen = async () => {
        if (idNhomQuyen) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.delete(url + "/api/nhom-quyen/" + idNhomQuyen, config);
                
                if(response.data.code === 200){
                    refreshNhomQuyens();
                    setErrorMessage("");
                    setShowThemNhomQuyenPopup(false);
                    toast.success("Xóa nhóm quyền thành công");
                }
                
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const getNhomQuyenTheoId = async () => {
        if (idNhomQuyen) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/nhom-quyen/" + idNhomQuyen, config);
                if(response.data.code === 200){
                    setData({
                        tenNhomQuyen: response.data.result.tenNhomQuyen
                    })
                }
            } catch (error) {
                console.log(er.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!isCapNhat) {
            ThemNhomQuyen();
        } else {
            capNhapNhomQuyen();
        }
    }

    return (
        <div className='them-nhom-quyen-popup'>
            <form onSubmit={onSubmit} action="" className="them-nhom-quyen-popup-container">
                <div className="them-nhom-quyen-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} nhóm quyền</h2>
                    <FontAwesomeIcon onClick={() => setShowThemNhomQuyenPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="them-nhom-quyen-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="tenNhomQuyen">Tên nhóm quyền</label>
                    <input id='tenNhomQuyen' onChange={onChangeHandler} value={data.tenNhomQuyen} name='tenNhomQuyen' type="text" placeholder='Nhập tên nhóm quyền' required />
                </div>
                {!isCapNhat
                    ?
                    <button type='submit'>Thêm mới</button>
                    :
                    <div className="capNhat">
                        <button type='submit'>Cập nhật</button>
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa nhóm quyền này?')) { xoaNhomQuyen() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemNhomQuyenPopup