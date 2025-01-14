import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import newsService from '../../services/news.service';
import './News.css';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'announcements',
    status: 'draft',
    is_featured: false
  });
  
  // Thêm state cho preview ảnh
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

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
        if (response.data.image_url) {
          setImagePreview(`http://localhost:5000${response.data.image_url}`);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch news detail');
      navigate('/news');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        if (!formData.title || !formData.content) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        const newsFormData = new FormData();

        // Thêm các trường dữ liệu vào FormData
        newsFormData.append('title', formData.title);
        newsFormData.append('content', formData.content);
        newsFormData.append('category', formData.category);
        newsFormData.append('status', formData.status);
        newsFormData.append('is_featured', formData.is_featured ? '1' : '0');

        // Thêm ảnh nếu có
        if (selectedImages[0]) {
            newsFormData.append('news_image', selectedImages[0]);
        }

        // Gọi API tương ứng
        const response = id
            ? await newsService.updateNews(id, newsFormData)
            : await newsService.addNews(newsFormData);

        if (response.success) {
            toast.success(`Tin tức đã được ${id ? 'cập nhật' : 'tạo'} thành công`);
            navigate('/news');
        } else {
            throw new Error(response.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Submit error:', error);
        toast.error(error.message || 'Không thể lưu tin tức');
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Preview ảnh chính
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
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
          <label>Ảnh tin tức</label>
          <div className="image-upload-container">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="image-input"
              id="news-images"
            />
            <label htmlFor="news-images" className="image-upload-label">
              <FaUpload /> Chọn ảnh
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
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
              required
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
