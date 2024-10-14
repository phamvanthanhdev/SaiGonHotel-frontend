import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { faFaceSmile, faGauge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Sidebar = () => {
	const { isExpand } = useContext(StoreContext);
	const navigate = useNavigate();

	return (
		<section id="sidebar" className={isExpand ? 'hide' : ''}>
			<a href="#" className="brand">
				<i className='bx'><FontAwesomeIcon icon={faFaceSmile} /></i>
				<span className="text">AdminHub</span>
			</a>
			<ul className="side-menu top">
				<li onClick={() => navigate("/")} className="active">
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Dashboard</span>
					</a>
				</li>
				<li onClick={() => navigate("/so-do-phong")}>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Sơ đồ phòng</span>
					</a>
				</li>
				<li onClick={() => navigate("/check-in")} name="check-in">
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Check-In</span>
					</a>
				</li>
				<li>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Phiếu đặt phòng</span>
					</a>
				</li>
				<li>
					<a className=''>
						<FontAwesomeIcon className='bx' icon={faGauge} />
						<span className="text">Team</span>
					</a>
				</li>
			</ul>
			<ul className="side-menu">
				<li>
					<a className=''>
						<i className='bx bxs-cog' ></i>
						<span className="text">Settings</span>
					</a>
				</li>
				<li>
					<a className="logout">
						<i className='bx bxs-log-out-circle' ></i>
						<span className="text">Logout</span>
					</a>
				</li>
			</ul>
		</section>
	)
}

export default Sidebar