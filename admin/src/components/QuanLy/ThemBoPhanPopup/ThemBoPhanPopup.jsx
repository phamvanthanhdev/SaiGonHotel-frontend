import React, { useContext, useEffect, useState } from 'react'
import './ThemBoPhanPopup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import { format } from "date-fns";

const ThemBoPhanPopup = ({ setShowThemBoPhanPopup, isCapNhat, setBoPhans, idBoPhan }) => {
    const { url, token } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        tenBoPhan: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (token) {
            if (isCapNhat) {
                getBoPhanTheoId();
            }
        }
    }, [token])

    const ThemBoPhan = async () => {
        try {
            const response = await axios.post(url + "/api/bo-phan/", data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            refreshBoPhans();
            setErrorMessage("");
            setShowThemBoPhanPopup(false);
            toast.success("Thêm bộ phận thành công");
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.response.data.message);
        }
    }


    const refreshBoPhans = async () => {
        try {
            const response = await axios.get(url + `/api/bo-phan/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setBoPhans(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const capNhapBoPhan = async () => {
        if (idBoPhan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.put(url + "/api/bo-phan/" + idBoPhan, data, config);
                
                refreshBoPhans();
                setErrorMessage("");
                setShowThemBoPhanPopup(false);
                toast.success("Cập nhật bộ phận thành công");
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const xoaBoPhan = async () => {
        if (idBoPhan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.delete(url + "/api/bo-phan/" + idBoPhan, config);
                
                if(response.data.code === 200){
                    refreshBoPhans();
                    setErrorMessage("");
                    setShowThemBoPhanPopup(false);
                    toast.success("Xóa bộ phận thành công");
                }
                
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const getBoPhanTheoId = async () => {
        if (idBoPhan) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await axios.get(url + "/api/bo-phan/" + idBoPhan, config);
                setData({
                    tenBoPhan: response.data.tenBoPhan
                })
            } catch (error) {
                console.log(er.message);
                setErrorMessage(error.response.data.message);
            }
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!isCapNhat) {
            ThemBoPhan();
        } else {
            capNhapBoPhan();
        }
    }

    return (
        <div className='them-bo-phan-popup'>
            <form onSubmit={onSubmit} action="" className="them-bo-phan-popup-container">
                <div className="them-bo-phan-popup-title">
                    <h2>{isCapNhat ? 'Cập nhật' : 'Thêm'} bộ phận</h2>
                    <FontAwesomeIcon onClick={() => setShowThemBoPhanPopup(false)} className="close" icon={faXmark} />
                </div>
                <div className="them-bo-phan-popup-inputs">
                    {errorMessage && <p className='error'>{errorMessage}</p>}

                    <label htmlFor="tenBoPhan">Tên bộ phận</label>
                    <input id='tenBoPhan' onChange={onChangeHandler} value={data.tenBoPhan} name='tenBoPhan' type="text" placeholder='Nhập tên bộ phận' required />
                </div>
                {!isCapNhat
                    ?
                    <button type='submit'>Thêm mới</button>
                    :
                    <div className="capNhat">
                        <button type='submit'>Cập nhật</button>
                        <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa bộ phận này?')) { xoaBoPhan() }; }} className='btnXoa' type='button'>Xóa</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default ThemBoPhanPopup