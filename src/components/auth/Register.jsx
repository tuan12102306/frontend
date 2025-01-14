import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../../services/auth.service';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    full_name: ''
  });
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => {
    if (!phone) {
      setPhoneError('Số điện thoại không được để trống');
      return false;
    }
    if (!/^0\d{9}$/.test(phone)) {
      setPhoneError('Số điện thoại phải có 10 số và bắt đầu bằng số 0');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate phone khi người dùng nhập
    if (name === 'phone') {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      return;
    }

    try {
      const response = await authService.register(
        formData.email,
        formData.phone,
        formData.password,
        formData.full_name
      );
      
      if (response.success) {
        toast.success('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="" alt="PTIT Logo" className="brand-logo" />
        <h2>Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="full_name"
              placeholder="Họ và tên"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              className={`phone-input ${phoneError ? 'error' : ''}`}
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {phoneError && (
              <div className="error-message">
                {phoneError}
              </div>
            )}
            <div className="requirements">
              Số điện thoại phải có 10 số và bắt đầu bằng số 0
            </div>
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">Đăng Ký</button>
        </form>
        <p className="register-link">
          Đã có tài khoản?{' '}
          <span onClick={() => navigate('/login')} className="link">
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
