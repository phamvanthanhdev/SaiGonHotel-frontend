import React, { useState } from 'react'
import Header from '../../components/Header/Header';
import './PlaceOrder.css'

const PlaceOrder = () => {

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const onChangeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async(event) =>{
        event.preventDefault();
        console.log(data);
    }

    return (
        <>
            <Header type="list" />
            <div>
                <form onSubmit={placeOrder} className='place-order'>
                    <div className="place-order-left">
                        <p className="title">Delivery Information</p>
                        <div className="multi-fields">
                            <input required onChange={onChangeHandle} name='firstName' value={data.firstName} type="text" placeholder='First name' />
                            <input required onChange={onChangeHandle} name='lastName' value={data.lastName} type="text" placeholder='Last name' />
                        </div>
                        <input required onChange={onChangeHandle} name='email' value={data.email} type="text" placeholder='Email address' />
                        <input required onChange={onChangeHandle} name='street' value={data.street} type="text" placeholder='Street' />
                        <div className="multi-fields">
                            <input required onChange={onChangeHandle} name='city' value={data.city} type="text" placeholder='City' />
                            <input required onChange={onChangeHandle} name='state' value={data.state} type="text" placeholder='State' />
                        </div>
                        <div className="multi-fields">
                            <input required onChange={onChangeHandle} name='zipcode' value={data.zipcode} type="text" placeholder='Zip code' />
                            <input required onChange={onChangeHandle} name='country' value={data.country} type="text" placeholder='Country' />
                        </div>
                        <input required onChange={onChangeHandle} name='phone' value={data.phone} type="text" placeholder='Phone' />
                    </div>
                    <div className="place-order-right">
                        <div className="cart-total">
                            <h2>Cart Totals</h2>
                            <div>
                                <div className="cart-total-details">
                                    <p>Subtotal</p>
                                    <p>$0</p>
                                </div>
                                <hr />
                                <div className="cart-total-details">
                                    <p>Delivery Fee</p>
                                    <p>$0</p>
                                </div>
                                <hr />
                                <div className="cart-total-details">
                                    <b>Total</b>
                                    <b>$0</b>
                                </div>
                            </div>
                            <button type='submit'>PROCEED TO PAYMENT</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PlaceOrder