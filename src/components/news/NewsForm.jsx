import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';
import newsService from '../../services/news.service';
import './News.css';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    category: 'announcements',
    status: 'draft',
    is_featured: false
  });

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const response = await newsService.getNewsById(id);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch news detail');
      navigate('/news');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = id
        ? await newsService.updateNews(id, formData)
        : await newsService.addNews(formData);

      if (response.success) {
        toast.success(`News ${id ? 'updated' : 'created'} successfully`);
        navigate('/news');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} news`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="news-form-container">
      <h2>{id ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}</h2>
      
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nội dung *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
          />
        </div>

        <div className="form-group">
          <label>Ảnh đại diện (URL)</label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="announcements">Thông báo</option>
              <option value="events">Sự kiện</option>
              <option value="updates">Cập nhật</option>
            </select>
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            Tin nổi bật
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/news')} 
            className="cancel-button"
          >
            <FaTimes /> Hủy
          </button>
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            <FaSave /> {loading ? 'Đang lưu...' : 'Lưu tin tức'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
