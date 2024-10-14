import { useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Checkin from './pages/Checkin/Checkin';
import PhieuDatDetails from './pages/PhieuDatDetails/PhieuDatDetails';
import PhieuThue from './pages/PhieuThue/PhieuThue';
import SoDoPhong from './pages/SoDoPhong/SoDoPhong';
import ChiTietPhieuThue from './pages/ChiTietPhieuThue/ChiTietPhieuThue';
import TraPhong from './pages/TraPhong/TraPhong';

function App() {
 
  return (
    <>
      <ToastContainer />
      {/* <Sidebar/>
      <div className='app'>
        <section id="content"> */}
          {/* <Navbar/> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<Checkin />} />
            <Route path="/phieu-dat/:id" element={<PhieuDatDetails />} />
            <Route path="/phieu-thue" element={<PhieuThue />} />
            <Route path="/so-do-phong" element={<SoDoPhong />} />
            <Route path="/chi-tiet-phieu-thue" element={<ChiTietPhieuThue />} />
            <Route path="/tra-phong" element={<TraPhong />} />
          </Routes>
        {/* </section> */}
      {/* </div> */}
    </>
  )
}

export default App
