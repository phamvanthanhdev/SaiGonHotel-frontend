import React, { useContext, useEffect, useState } from 'react'
import './KhachHangUpload.css'
import { StoreContext } from '../../context/StoreContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify'
import ImportKhachHangPopup from '../../components/ImportKhachHangPopup/ImportKhachHangPopup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const KhachHangUpload = () => {
    const { url, token, isExpand } = useContext(StoreContext);
    const [fileNames, setFileNames] = useState([]);
    const [data, setData] = useState([]);
    const [showImportKhachHangPopup, setShowImportKhachHangPopup] = useState(false);

    const [cccd, setCccd] = useState();
    const [hoTen, setHoTen] = useState();
    const [gioiTinh, setGioiTinh] = useState();
    const [ngaySinh, setNgaySinh] = useState();
    const [sdt, setSdt] = useState();
    const [email, setEmail] = useState();
    const [diaChi, setDiaChi] = useState();
    const [showAlert, setShowAlert] = useState();

    const fetchFileNames = async () => {
        try {
            const response = await axios.get(url + "/api/khach-hang/name-excel", { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.code === 200) {
                setFileNames(response.data.result);
                if(response.data.result.length > 0){
                    getDataFile(response.data.result[0].tenFileOriginal);
                }
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
            fetchFileNames();
        }
    }, [token])

    const getDataFile = async (tenFile) => {
        try {
            const response = await axios.get(url + "/api/khach-hang/ten-file/" + tenFile, { headers: { Authorization: `Bearer ${token}` } })
            if (response.data.code === 200) {
                setData(response.data.result)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const onClick = (tenFileOriginal) => {
        getDataFile(tenFileOriginal);
    }

    const openImportKhachHangPopup = (cccd, hoTen, gioiTinh, ngaySinh, sdt, email, diaChi) => {
        setCccd(cccd);
        setHoTen(hoTen);
        setGioiTinh(gioiTinh);
        setNgaySinh(ngaySinh);
        setSdt(sdt);
        setEmail(email);
        setDiaChi(diaChi);
        setShowImportKhachHangPopup(true);
    }

    const importToanBoKhachHang = async () => {
        try {
            const response = await axios.post(url + "/api/khach-hang/import-toan-bo", data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.data.code === 200) {
                toast.success("Import thông tin khách hàng thành công");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const onClickImportToanBo = () => {
        setShowAlert(true);
    }

    const handleClose = ()=>{
        setShowAlert(false);
    }

    const handleImport = ()=>{
        importToanBoKhachHang();
        setShowAlert(false);
    }


    return (
        <>
            <Sidebar />
            <div className='app'>
                <section id="content" className={isExpand && 'expand'}>
                    {showImportKhachHangPopup ? <ImportKhachHangPopup
                        cccd={cccd}
                        hoTen={hoTen}
                        gioiTinh={gioiTinh}
                        ngaySinh={ngaySinh}
                        sdt={sdt}
                        email={email}
                        diaChi={diaChi}
                        setShowImportKhachHangPopup={setShowImportKhachHangPopup}
                    /> : <></>}
                    <Navbar />
                    <main className='khach-hang-upload'>

                        {/* alert import tất cả danh sách khách hàng trong file */}
                        <Modal show={showAlert} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Xác nhận import khách hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Bạn chắc chắn muốn import tất cả thông tin khách hàng trong file này?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Hủy
                                </Button>
                                <Button variant="primary" onClick={handleImport}>
                                    Xác nhận
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div className="head-title">
                            <div className="left">
                                <h1>Thông tin khách hàng tải lên</h1>

                            </div>

                        </div>

                        <div className="table-data">
                            <div className="todo">
                                <div className="head">
                                    <h3>Danh sách files</h3>
                                    <i className='bx bx-plus' ></i>
                                    <i className='bx bx-filter' ></i>
                                </div>
                                <ul className="todo-list">
                                    {fileNames.map((item, index) => {
                                        return (
                                            <li onClick={() => onClick(item.tenFileOriginal)} key={index} className="completed">
                                                <p>Tên công ty: {item.tenFile}</p>
                                                <p>Ngày gửi: {item.thoiGian}</p>
                                                <p>Mã phiếu đặt: {item.idPhieuDat}</p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="order">
                                <div className="head">
                                    <h3>Thông tin khách hàng</h3>
                                    {data.length > 0 && 
                                        <button onClick={onClickImportToanBo} className='btn btn-primary'>Import toàn bộ</button>
                                    }
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>CCCD</th>
                                            <th>Họ tên</th>
                                            <th>GT</th>
                                            <th>Ngày sinh</th>
                                            <th>SĐT</th>
                                            <th>Email</th>
                                            <th>Địa chỉ</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}.</td>
                                                    <td>{item.cccd}</td>
                                                    <td>{item.hoTen}</td>
                                                    <td>{item.gioiTinh}</td>
                                                    <td>{item.ngaySinh}</td>
                                                    <td>{item.sdt}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.diaChi}</td>
                                                    <td><button
                                                        onClick={() => openImportKhachHangPopup(item.cccd, item.hoTen, item.gioiTinh, item.ngaySinh, item.sdt, item.email, item.diaChi)}
                                                        className='btn btn-primary'>Thêm
                                                    </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
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

export default KhachHangUpload