import React, { useContext, useRef } from 'react'
import './InBaoCao.css'
import { useReactToPrint } from 'react-to-print';
import { StoreContext } from '../../context/StoreContext';

const InBaoCao = ({ setInBaoCao, type, ngayBatDau, ngayKetThuc, thangBatDau, thangKetThuc,
    quyBatDau, quyKetThuc, doanhThuNgays, doanhThuThangs, doanhThuQuys, hoTenNhanVien, nam
}) => {
    const { convertDateShow } = useContext(StoreContext);
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const d = new Date();
    let day = d.getDate();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;

    const tinhTongDoanhThuNgay = () => {
        let tongDoanhThuNgay = 0;
        for (let i = 0; i < doanhThuNgays.length; i++) {
            tongDoanhThuNgay += doanhThuNgays[i].tongTien;
        }
        return tongDoanhThuNgay;
    }

    const tinhTongDoanhThuThang = () => {
        let tongDoanhThuThang = 0;
        for (let i = 0; i < doanhThuThangs.length; i++) {
            tongDoanhThuThang += doanhThuThangs[i].doanhThu;
        }
        return tongDoanhThuThang;
    }

    const tinhTongDoanhThuQuy = () => {
        let tongDoanhThuQuy = 0;
        for (let i = 0; i < doanhThuQuys.length; i++) {
            tongDoanhThuQuy += doanhThuQuys[i].doanhThu;
        }
        return tongDoanhThuQuy;
    }

    return (
        <>
            <div className='btnBaoCao'>
                <button onClick={() => setInBaoCao(false)} className='btn btn-danger'>Trở lại</button>
                <button onClick={reactToPrintFn} className='btn btn-success'>In báo cáo</button>
            </div>
            <div ref={contentRef} className="in-bao-cao">
                <div className="info">
                    <p>Công ty cổ phần SAIGON Hotel</p>
                    <p>Địa chỉ: 97 Man Thiện, phường Hiệp Phú, TP Thủ Đức</p>
                </div>
                <div className="head">
                    <h1>BÁO CÁO DOANH THU {type === 'theo-ngay' ? 'NGÀY' : type === 'theo-thang' ? 'THÁNG TRONG NĂM ' + nam : 'QUÝ TRONG NĂM ' + nam}</h1>
                    <p>{type === 'theo-ngay' ? `Từ ngày ${convertDateShow(ngayBatDau)} đến ngày ${convertDateShow(ngayKetThuc)}`
                        : type === 'theo-thang' ? `Từ tháng ${thangBatDau} năm ${nam} đến tháng ${thangKetThuc} năm ${nam}`
                            : `Từ quý ${quyBatDau} năm ${nam} đến quý ${quyKetThuc} năm ${nam}`}</p>
                </div>
                <div className='table-data'>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Thời gian</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {type === 'theo-ngay' && doanhThuNgays.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{convertDateShow(item.ngayTao)}</td>
                                        <td>{item.tongTien.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                    </tr>
                                )
                            })
                            }

                            {type === "theo-thang" &&
                                doanhThuThangs.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}.</td>
                                            <td>Tháng {item.thang}</td>
                                            <td>{item.doanhThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        </tr>
                                    )
                                })
                            }

                            {type === "theo-quy" &&
                                doanhThuQuys.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}.</td>
                                            <td>Quý {item.quy}</td>
                                            <td>{item.doanhThu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        </tr>
                                    )
                                })
                            }

                            <tr key='tong'>
                                <td>Tổng doanh thu: </td>
                                <td></td>
                                {type === 'theo-ngay' && 
                                    <td>{tinhTongDoanhThuNgay().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                }
                                {type === 'theo-thang' && 
                                    <td>{tinhTongDoanhThuThang().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                }
                                {type === 'theo-quy' && 
                                    <td>{tinhTongDoanhThuQuy().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="footer">
                    <div className="left">
                        <p>Người lập phiếu</p>
                        <p>{hoTenNhanVien}</p>
                    </div>
                    <div className="right">
                        <p>TP Hồ Chí Minh, ngày {day} tháng {month} năm {year}</p>
                        <p>KẾ TOÁN TRƯỞNG</p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default InBaoCao