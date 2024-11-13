import React, { useContext, useEffect, useState } from 'react'
import './QuanLyTrangThai.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { StoreContext } from '../../context/StoreContext'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const QuanLyTrangThai = () => {
    const { url, token, isExpand, convertDateShow } = useContext(StoreContext);
    const [trangThais, setTrangThais] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCapNhat, setIsCapNhat] = useState("");
    const [idTrangThai, setIdTrangThai] = useState("");
    const [data, setData] = useState({
        tenTrangThai: ""
    })


    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const fetchTrangThais = async () => {
        try {
            const response = await axios.get(url + `/api/trang-thai/all`,
                { headers: { Authorization: `Bearer ${token}` } });
            setTrangThais(response.data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchTrangThais();
        }
    }, [token])

    const themTrangThai = async () => {
    	try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.post(url + `/api/trang-thai/`, data, config);
            if(response.data.code === 200){
    		    toast.success("Thêm trạng thái thành công");
                fetchTrangThais();
            }else{
                toast.error(response.data.message);
            }
    	} catch (error) {
    		console.log(error.message);
            setErrorMessage(error.response.data.message);
    		toast.error(error.response.data.message);
    	}
    }

    const capNhatTrangThai = async () => {
    	try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.put(url + `/api/trang-thai/` + idTrangThai, data, config);
            if(response.data.code === 200){
    		    toast.success("Cập nhật trạng thái thành công");
                fetchTrangThais();
            }else{
                setErrorMessage(response.data.message);
                toast.error(response.data.message);
            }
    	} catch (error) {
    		console.log(error.message);
    		toast.error(error.response.data.message);
    	}
    }

    const xoaTrangThai = async (idTrangThai) => {
    	try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
    		const response = await axios.delete(url + `/api/trang-thai/` + idTrangThai, config);
            if(response.data.code === 200){
    		    toast.success("Xóa trạng thái thành công");
                fetchTrangThais();
            }else{
                toast.error(response.data.message);
            }
    	} catch (error) {
    		console.log(error.message);
            setErrorMessage(error.response.data.message);
    		toast.error(error.response.data.message);
    	}
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(isCapNhat)
            capNhatTrangThai();
        else
            themTrangThai();
    }

    const onHandleThemChecked = (e) => {
        if(e.target.checked)
            setIsCapNhat(false);
    }

    const onHandleCapNhatChecked = (e) => {
        if(e.target.checked)
            setIsCapNhat(true);
    }

    const onClickCapNhat = (idTrangThai, tenTrangThai)=>{
        setIdTrangThai(idTrangThai);
        setData(data => ({ ...data, 'tenTrangThai': tenTrangThai }));
    }

    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    <Navbar />
                    <main className='trang-thai'>

                        <div className="trang-thai-container">
                            <div className="todo">
                                <div className="phieu-thue">
                                    <div className="head">
                                        <h3>Thông tin trạng thái</h3>
                                        <i className='bx bx-plus' ></i>
                                        <i className='bx bx-filter' ></i>
                                    </div>
                                    <div className="information">
                                        <form onSubmit={onSubmitHandler}>
                                            {errorMessage && <p className='error'>{errorMessage}</p>}
                                            <div class="form-check">
                                                <input onChange={onHandleThemChecked} class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked/>
                                                <label class="form-check-label" for="flexRadioDefault1">
                                                    Thêm mới
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input onChange={onHandleCapNhatChecked} class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                <label class="form-check-label" for="flexRadioDefault2">
                                                    Cập nhật
                                                </label>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleFormControlInputTenTrangThai" className="form-label">Tên trạng thái</label>
                                                <input onChange={onChangeHandle} name='tenTrangThai' value={data.tenTrangThai} type="text" className="form-control" id="exampleFormControlInputTenTrangThai" placeholder="Nhập tên trạng thái" required />
                                            </div>

                                            <button type="submit" className="btn btn-primary">Xác nhận</button>
                                        </form>
                                    </div>
                                </div>

                            </div>

                            <div className="order">
                                <div className="head">
                                    <h3>Danh sách trạng thái</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Mã trạng thái</th>
                                            <th>Tên trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            trangThais.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.idTrangThai}</td>
                                                        <td>{item.tenTrangThai}</td>
                                                        <td>
                                                            <button onClick={()=>onClickCapNhat(item.idTrangThai, item.tenTrangThai)} className='btn btn-primary'>Cập nhật</button>
                                                            <button onClick={() => {if(window.confirm('Bạn có chắc chắn muốn xóa trạng thái này?')){xoaTrangThai(item.idTrangThai)};}} className='btn btn-danger'>Xóa</button>
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

export default QuanLyTrangThai