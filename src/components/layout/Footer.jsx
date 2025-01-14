import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về PTIT</h3>
          <p>Thư viện PTIT - Nơi kết nối tri thức và đam mê đọc sách, phục vụ cộng đồng sinh viên và giảng viên.</p>
          <div className="social-links">
            <a href="https://facebook.com/ptit" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://youtube.com/ptit" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href="https://instagram.com/ptit" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><Link to="/home">Trang chủ</Link></li>
            <li><Link to="/books">Sách</Link></li>
            <li><Link to="/services">Dịch vụ</Link></li>
            <li><Link to="/news">Tin tức</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Dịch Vụ</h3>
          <ul>
            <li>Mượn sách</li>
            <li>Đọc tại chỗ</li>
            <li>Tài liệu số</li>
            <li>Hỗ trợ nghiên cứu</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Liên Hệ</h3>
          <div className="contact-info">
            <p><FaPhone /> +84 123 456 789</p>
            <p><FaEnvelope /> library@ptit.edu.vn</p>
            <p><FaMapMarkerAlt /> 122 Hoàng Quốc Việt, Hà Nội</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Thư viện PTIT. Bản quyền thuộc về Học viện Công nghệ Bưu chính Viễn thông.</p>
      </div>
    </footer>
  );
};

export default Footer; 