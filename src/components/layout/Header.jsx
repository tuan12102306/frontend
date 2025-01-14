import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa';
import authService from '../../services/auth.service';
import NotificationIcon from './NotificationIcon';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="logo">PTIT</Link>
        <ul className="nav-links">
          <li className={isActive("/home")}>
            <Link to="/home">Home</Link>
          </li>
          <li className={isActive("/books")}>
            <Link to="/books">Books</Link>
          </li>
          <li className={isActive("/services")}>
            <Link to="/services">Services</Link>
          </li>
          <li className={isActive("/news")}>
            <Link to="/news">News</Link>
          </li>
          <li className={isActive("/contact")}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div className="nav-right">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="nav-icons">
          <NotificationIcon />
          <div className="user-profile" onClick={() => navigate('/profile')}>
            <FaUser className="icon" />
            <span>{user?.user?.full_name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header; 