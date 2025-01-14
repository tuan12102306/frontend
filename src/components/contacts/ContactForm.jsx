import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import contactService from '../../services/contact.service';
import './Contacts.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await contactService.createContact(formData);
      if (response.success) {
        toast.success('Cảm ơn bạn đã đóng góp ý kiến!');
        setFormData({ subject: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi ý kiến, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-form-container">
      <h2>Đóng Góp Ý Kiến</h2>
      <p className="contact-description">
        Chúng tôi luôn mong muốn được lắng nghe ý kiến đóng góp của bạn để cải thiện và phát triển thư viện ngày càng tốt hơn.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề ý kiến đóng góp"
          />
        </div>

        <div className="form-group">
          <label>Nội dung *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Nhập nội dung ý kiến đóng góp của bạn"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          <FaPaperPlane /> {loading ? 'Đang gửi...' : 'Gửi ý kiến'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
