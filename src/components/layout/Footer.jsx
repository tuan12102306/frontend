import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>PTIT Platform - Your trusted partner in technology and innovation.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/books">Books</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: info@ptit.edu.vn</p>
          <p>Phone: +84 123 456 789</p>
          <p>Address: Hanoi, Vietnam</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 PTIT Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 