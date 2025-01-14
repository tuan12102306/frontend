import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaNewspaper, FaStar, FaEye } from 'react-icons/fa';
import newsService from '../../services/news.service';
import './News.css';

const NewsList = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    total_pages: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    featured: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchNews();
  }, [pagination.page, filters]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('Fetching news with params:', {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await newsService.getAllNews({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      console.log('API Response:', response); // Debug response

      if (response.success) {
        setNews(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          total_pages: response.pagination.total_pages
        }));
      }
    } catch (error) {
      console.error('Fetch news error:', error);
      toast.error('Không thể tải tin tức');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="news-container">
      <div className="news-header">
        <h2><FaNewspaper /> Tin Tức Thư Viện</h2>
        <div className="news-filters">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả danh mục</option>
            <option value="events">Sự kiện</option>
            <option value="announcements">Thông báo</option>
            <option value="updates">Cập nhật</option>
          </select>

          {isAdmin && (
            <button className="add-button" onClick={() => navigate('/news/add')}>
              <FaPlus /> Thêm tin tức
            </button>
          )}
        </div>
      </div>

      <div className="news-grid">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="news-card">
              <div className="news-image">
                <img 
                  src={item.image_url ? `http://localhost:5000${item.image_url}` : '/default-news.png'}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-news.png';
                  }}
                />
                {item.is_featured && (
                  <span className="featured-badge">
                    <FaStar /> Nổi bật
                  </span>
                )}
              </div>
              <div className="news-content">
                <h3>{truncateText(item.title, 60)}</h3>
                <p className="news-excerpt">{truncateText(item.content, 120)}</p>
                <div className="news-meta">
                  <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                  <span>Tác giả: {item.author_name || 'Admin'}</span>
                  <span><FaEye /> {item.view_count || 0}</span>
                </div>
                <Link to={`/news/${item.id}`} className="read-more">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-news">Không có tin tức nào</div>
        )}
      </div>

      {pagination.total_pages > 1 && (
        <div className="pagination">
          {[...Array(pagination.total_pages)].map((_, index) => (
            <button
              key={index + 1}
              className={pagination.page === index + 1 ? 'active' : ''}
              onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
