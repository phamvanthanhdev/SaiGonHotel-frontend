import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Featured from '../../components/Featured/Featured'
import PropertyList from '../../components/PropertyList/PropertyList'
import FeaturedProperties from '../../components/FeaturedProperties/FeaturedProperties'
import Footer from '../../components/Footer/Footer'
import MailList from '../../components/MailList/MailList'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import FeaturedBestSeller from '../../components/FeaturedBestSeller/FeaturedBestSeller'

const Home = () => {
  const {url} = useContext(StoreContext);
  const [kieuPhong, setKieuPhong] = useState([]);

  const fetchKieuPhong = async() =>{
    const response = await axios.get(url+"/api/kieu-phong/so-luong");
    setKieuPhong(response.data);
  }

  useEffect(()=>{
    fetchKieuPhong();
  }, [])

  return (
    <div className="home">
      <Header />
      <div className="homeContainer">
        {/* <Featured /> */}
        {/* <h1 className="homeTitle">Browse by property type</h1> */}
        <PropertyList kieuPhong={kieuPhong}/>
        <h1 className="homeTitle">Được giảm giá nhiều nhất</h1>
        <FeaturedProperties />
        <h1 className="homeTitle">Được nhiều người lựa chọn nhất</h1>
        <FeaturedBestSeller />
        <MailList/>
      </div>
    </div>
  )
}

export default Home