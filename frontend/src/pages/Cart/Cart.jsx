import React, { useContext } from 'react'
import './Cart.css'
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { StoreContext } from '../../context/StoreContext';

const Cart = () => {
    const {hangPhong, cartItems, setCartItems, calculateDateDifference, removeFromCart} = useContext(StoreContext);
    const navigate = useNavigate();

    return (
        <>
            {/* <Header type="list" /> */}
            <div className='cart'>
                <div className="cart-container">
                    {/* <div className='cart-date'>
                        <span>Check-In: Thu, 26 Sep 2024</span>
                        <span>Check-out: Thu, 26 Sep 2024</span>
                    </div> */}
                    <div className="cart-items">
                        <div className="cart-items-title">
                            <p>Hình ảnh</p>
                            <p>Hạng phòng</p>
                            <p>Giá phòng</p>
                            <p>Số lượng đặt</p>
                            <p>Tổng tiền</p>
                            <p>Xóa</p>
                        </div>
                        <br />
                        <hr />
                        {hangPhong.map((item, index) => {
                            if (cartItems[item.idHangPhong] > 0) {
                                return (
                                    <div key={index} >
                                        <div className="cart-items-title cart-items-item">
                                            <img src={`data:image/png;base64, ${item.hinhAnh}`} alt="" />
                                            <p>{item.tenHangPhong}</p>
                                            <p>
                                            {
                                                item.phanTramGiam > 0
                                                ? <p>{(item.giaKhuyenMai).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                :<p>{(item.giaGoc).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                            }
                                            </p>
                                            <p>{cartItems[item.idHangPhong]}</p>
                                            {
                                                item.phanTramGiam > 0
                                                ? <p>{(item.giaKhuyenMai * cartItems[item.idHangPhong] * calculateDateDifference()).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                <small>({calculateDateDifference()} đêm)</small></p>
                                                :<p>{(item.giaGoc * cartItems[item.idHangPhong] * calculateDateDifference()).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                <small>({calculateDateDifference()} đêm)</small></p>
                                            }
                                            
                                            <p onClick={() => removeFromCart(item.idHangPhong)} className='cross'>x</p>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            }
                })}
                    </div>
                    <div className="cart-bottom">
                        <div className="cart-total">
                            {/* <h2>Cart Totals</h2> */}
                            {/* <div>
                                <div className="cart-total-details">
                                    <p>Subtotal</p>
                                    <p>$0</p>
                                </div>
                                <div className="cart-total-details">
                                    <p>Delivery Fee</p>
                                    <p>$0</p>
                                </div>
                                <hr />
                                <div className="cart-total-details">
                                    <b>Total</b>
                                    <b>$0</b>
                                </div>
                            </div> */}
                            <button onClick={() => navigate('/book')}>BƯỚC TIẾP THEO</button>
                        </div>
                        <div className="cart-promocode">
                            {/* <div>
                                <p>If you have a promo code, Enter it here</p>
                                <div className="cart-promocode-input">
                                    <input type="text" placeholder='promo code' />
                                    <button>Submit</button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart