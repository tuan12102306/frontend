import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../../services/auth.service';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login_id: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData.login_id, formData.password);
      toast.success('Đăng nhập thành công!');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-left-content">
            <h2>Chào mừng trở lại!</h2>
            <p>Hệ thống thư viện trực tuyến PTIT</p>
            <div className="illustration">
              {/* Có thể thêm ảnh minh họa ở đây */}
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h1>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
            <h2>HỆ THỐNG THƯ VIỆN TRỰC TUYẾN</h2>
          </div>

          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tài khoản</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="login_id"
                    placeholder="Nhập tài khoản của bạn"
                    value={formData.login_id}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn">
                Đăng nhập
              </button>

              <div className="register-link">
                <span>Bạn chưa có tài khoản? </span>
                <span className="register-now" onClick={() => navigate('/register')}>
                  Đăng ký ngay
                </span>
              </div>
            </form>
          </div>

          <div className="footer">
            <p>© 2024 Học viện Công nghệ Bưu chính Viễn thông</p>
            <p>Developed by AISoft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
