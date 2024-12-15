import React, { useContext } from 'react'
import './Navbar.css'
import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from '../../context/StoreContext';

const Navbar = () => {
    const {isExpand, setIsExpand, nhanVien} = useContext(StoreContext);
    const handleClick = () => {
        setIsExpand(!isExpand);
    }

    return (
        <nav>
            <FontAwesomeIcon onClick={handleClick} className='bx' icon={faBars} />
            {/* <a href="#" className="nav-link">Categories</a> */}
            <form action="#">
                {/* <div className="form-input">
                    <input type="search" placeholder="Search..."/>
                        <button type="submit" className="search-btn"><i className='bx bx-search' ></i></button>
                </div> */}
            </form>
            <input type="checkbox" id="switch-mode" hidden/>
                {/* <label htmlFor="switch-mode" className="switch-mode"></label>
                <a href="#" className="notification">
                    <FontAwesomeIcon className="bx" icon={faBell} />
                    <span className="num">8</span>
                </a> */}
                {nhanVien && 
                <>
                    <label htmlFor="">Mã nhân viên: {nhanVien.idNhanVien}</label>
                    <label htmlFor="">Tên nhân viên: {nhanVien.hoTen}</label>
                    <label htmlFor="">Nhóm quyền: {nhanVien.tenNhomQuyen}</label>
                </>
                }
                {/* <a href="#" className="profile">
                    <img src="https://vcdn1-giaitri.vnecdn.net/2020/03/29/991816090-56782878-2.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=_VlKS8qAdvKfuUrToqwCbw"/>
                </a> */}
        </nav>
    )
}

export default Navbar