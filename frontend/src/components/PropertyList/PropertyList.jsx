import React from 'react'
import './PropertyList.css'
import { useNavigate } from 'react-router-dom';

const PropertyList = ({ kieuPhong }) => {
    const navigate = useNavigate();
    const handleClick = (destination) => {
        navigate("/hotels", { state: { destination } });
    };

    return (
        <div className="pList">
            {kieuPhong.map((item, index) => {
                return (
                    <div onClick={() => handleClick(item.tenKieuPhong)} key={index} className="pListItem">
                        <img
                            src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg"
                            alt=""
                            className="pListImg"
                        />
                        <div className="pListTitles">
                            <h1>{item.tenKieuPhong}</h1>
                            <h2>{item.soLuong} phòng</h2>
                        </div>
                    </div>
                )
            })}
            {/* <div className="pListItem">
                <img
                    src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg"
                    alt=""
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Apartments</h1>
                    <h2>2331 hotels</h2>
                </div>
            </div>
            <div className="pListItem">
                <img
                    src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg"
                    alt=""
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Resorts</h1>
                    <h2>2331 hotels</h2>
                </div>
            </div>
            <div className="pListItem">
                <img
                    src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg"
                    alt=""
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Villas</h1>
                    <h2>2331 hotels</h2>
                </div>
            </div>
            <div className="pListItem">
                <img
                    src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
                    alt=""
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Cabins</h1>
                    <h2>2331 hotels</h2>
                </div>
            </div> */}
        </div>
    )
}

export default PropertyList