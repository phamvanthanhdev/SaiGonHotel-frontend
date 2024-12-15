import React, { useContext, useState } from 'react'
import './LoadingPopup.css'
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadingPopup = () => {

  return (
        <div className='loading-popup'>
            <div className="loading-popup-container">
                <p>Chờ xử lý...</p>
            </div>
        </div>
  )
}

export default LoadingPopup