import React from 'react'
import './Recommend.css'
import Search from '../Search/Search'
import {
    faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Recommend = () => {
    return (
        <div className='recommend'>
            <h2>Được gợi ý</h2>
            <Search />
            <div className="pro-recommend">
                <div className='table-left'>
                <table className='content-table'>
                    <thead>
                        <tr>
                            <th>Loại chỗ nghỉ</th>
                            <th>Số lượng khách</th>
                            <th>Giá hôm nay</th>
                            <th>Các lựa chọn</th>
                            <th>Chọn phòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="type">
                                    <a href='#'><span>Phòng Tiêu Chuẩn Giường Đôi</span></a>
                                    <p>1 giường đôi</p>
                                </div>
                            </td>
                            <td>
                                <div className="people">
                                    <FontAwesomeIcon icon={faUser} />
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            </td>
                            <td>
                                <div className='price'>
                                    <del>VND 555.063</del>
                                    <h3>VND 355.063</h3>
                                    <span>Tiết kiệm được VND 200.000</span>
                                </div>
                            </td>
                            <td>
                                <div className='info'>
                                    <p>Được xử lý bởi công ty đối tác của Booking.com</p>
                                    <ul>
                                        <li>Không chỉnh sửa</li>
                                        <li>Xác nhận trong vòng 2 phút</li>
                                        <li>Không thể áp dụng chung với các ưu đãi khác</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div className="select-quantity">
                                    <select>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="type">
                                    <a href='#'><span>Phòng Tiêu Chuẩn Giường Đôi</span></a>
                                    <p>1 giường đôi</p>
                                </div>
                            </td>
                            <td>
                                <div className="people">
                                    <FontAwesomeIcon icon={faUser} />
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            </td>
                            <td>
                                <div className='price'>
                                    <del>VND 555.063</del>
                                    <h3>VND 355.063</h3>
                                    <span>Tiết kiệm được VND 200.000</span>
                                </div>
                            </td>
                            <td>
                                <div className='info'>
                                    <p>Được xử lý bởi công ty đối tác của Booking.com</p>
                                    <ul>
                                        <li>Không chỉnh sửa</li>
                                        <li>Xác nhận trong vòng 2 phút</li>
                                        <li>Không thể áp dụng chung với các ưu đãi khác</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div className="select-quantity">
                                    <select>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="type">
                                    <a href='#'><span>Phòng Tiêu Chuẩn Giường Đôi</span></a>
                                    <p>1 giường đôi</p>
                                </div>
                            </td>
                            <td>
                                <div className="people">
                                    <FontAwesomeIcon icon={faUser} />
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            </td>
                            <td>
                                <div className='price'>
                                    <del>VND 555.063</del>
                                    <h3>VND 355.063</h3>
                                    <span>Tiết kiệm được VND 200.000</span>
                                </div>
                            </td>
                            <td>
                                <div className='info'>
                                    <p>Được xử lý bởi công ty đối tác của Booking.com</p>
                                    <ul>
                                        <li>Không chỉnh sửa</li>
                                        <li>Xác nhận trong vòng 2 phút</li>
                                        <li>Không thể áp dụng chung với các ưu đãi khác</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div className="select-quantity">
                                    <select>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="type">
                                    <a href='#'><span>Phòng Tiêu Chuẩn Giường Đôi</span></a>
                                    <p>1 giường đôi</p>
                                </div>
                            </td>
                            <td>
                                <div className="people">
                                    <FontAwesomeIcon icon={faUser} />
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            </td>
                            <td>
                                <div className='price'>
                                    <del>VND 555.063</del>
                                    <h3>VND 355.063</h3>
                                    <span>Tiết kiệm được VND 200.000</span>
                                </div>
                            </td>
                            <td>
                                <div className='info'>
                                    <p>Được xử lý bởi công ty đối tác của Booking.com</p>
                                    <ul>
                                        <li>Không chỉnh sửa</li>
                                        <li>Xác nhận trong vòng 2 phút</li>
                                        <li>Không thể áp dụng chung với các ưu đãi khác</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div className="select-quantity">
                                    <select>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className='table-right'>
                    <div className='fake-col'></div>
                    <div className="booking">
                        <p><strong>2</strong> phòng tổng giá</p>
                        <h3>VND 805.000</h3>
                        <span>Tiết kiệm được 200.000 VND</span>
                        <button>Tôi sẽ đặt</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recommend