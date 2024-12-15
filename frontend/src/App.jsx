import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Hotel from './pages/Hotel/Hotel'
import List from './pages/List/List'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Cart from './pages/Cart/Cart'
import MyOrders from './pages/MyOrders/MyOrders'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Book from './pages/Book/Book'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultPayment from './pages/ResultPayment/ResultPayment'
import OrderDetails from './pages/OrderDetails/OrderDetails'
import ResultPaymentAfter from './pages/ResultPaymentAfter/ResultPaymentAfter'
import MyProfile from './pages/MyProfile/MyProfile'

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer/>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<List />} />
          <Route path="/hotels/:id" element={<Hotel />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/my-orders' element={<MyOrders setShowLogin={setShowLogin}/>} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/book' element={<Book />} />
          <Route path='/result-payment' element={<ResultPayment />} />
          <Route path='/result-payment-after' element={<ResultPaymentAfter />} />
          <Route path='/order-details/:id' element={<OrderDetails />} />
          <Route path='/my-profile' element={<MyProfile />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
