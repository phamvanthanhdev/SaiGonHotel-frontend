import React from 'react'
import './HoaDonDetails.css'

const HoaDonDetails = () => {
    return (
        <div className='hoa-don-details'>
            <div className="head">
                <h2>HÓA ĐƠN</h2>
            </div>
            <div className="infomation">
                <div className="left">
                    <p>Số hóa đơn: 1234567</p>
                    <p>Tên khách hàng: Phạm Văn Thành</p>
                </div>
                <div className="right">
                    <p>Nhân viên lập: Nguyễn Viết Sĩ</p>
                    <p>Mã phiếu thuê: 100</p>
                </div>
            </div>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Date Order</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <img src="img/people.png" />
                                <p>John Doe</p>
                            </td>
                            <td>01-10-2021</td>
                            <td><span className="status completed">Completed</span></td>
                        </tr>
                        <tr>
                            <td>
                                <img src="img/people.png" />
                                <p>John Doe</p>
                            </td>
                            <td>01-10-2021</td>
                            <td><span className="status pending">Pending</span></td>
                        </tr>
                        <tr>
                            <td>
                                <img src="img/people.png" />
                                <p>John Doe</p>
                            </td>
                            <td>01-10-2021</td>
                            <td><span className="status process">Process</span></td>
                        </tr>
                        <tr>
                            <td>
                                <img src="img/people.png" />
                                <p>John Doe</p>
                            </td>
                            <td>01-10-2021</td>
                            <td><span className="status pending">Pending</span></td>
                        </tr>
                        <tr>
                            <td>
                                <img src="img/people.png" />
                                <p>John Doe</p>
                            </td>
                            <td>01-10-2021</td>
                            <td><span className="status completed">Completed</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HoaDonDetails