import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaNewspaper, FaStar } from 'react-icons/fa';
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
      const response = await newsService.getAllNews({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        status: 'published'
      });
      
      if (response.success) {
        setNews(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch news');
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
        {news.map((item) => (
          <div key={item.id} className="news-card">
            {item.thumbnail && (
              <div className="news-image">
                <img src={item.thumbnail} alt={item.title} />
                {item.is_featured && (
                  <span className="featured-badge">
                    <FaStar /> Nổi bật
                  </span>
                )}
              </div>
            )}
            <div className="news-content">
              <h3>
                <Link to={`/news/${item.id}`}>{item.title}</Link>
              </h3>
              <div className="news-meta">
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span>Tác giả: {item.author_name}</span>
                <span>Lượt xem: {item.view_count}</span>
              </div>
            </div>
          </div>
        ))}
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
