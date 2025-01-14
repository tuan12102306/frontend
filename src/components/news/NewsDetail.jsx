import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaEye } from 'react-icons/fa';
import newsService from '../../services/news.service';
import './News.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const response = await newsService.getNewsById(id);
      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch news detail');
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        const response = await newsService.deleteNews(id);
        if (response.success) {
          toast.success('News deleted successfully');
          navigate('/news');
        }
      } catch (error) {
        toast.error('Failed to delete news');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!news) return null;

  return (
    <div className="news-detail-container">
      <div className="news-detail-header">
        <button className="back-button" onClick={() => navigate('/news')}>
          <FaArrowLeft /> Quay lại
        </button>
        {isAdmin && (
          <div className="admin-actions">
            <button className="edit-button" onClick={() => navigate(`/news/edit/${id}`)}>
              <FaEdit /> Sửa
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash /> Xóa
            </button>
          </div>
        )}
      </div>

      <article className="news-detail-content">
        <h1>{news.title}</h1>
        
        <div className="news-meta">
          <span>Đăng ngày: {new Date(news.created_at).toLocaleDateString('vi-VN')}</span>
          <span>Tác giả: {news.author_name}</span>
          <span><FaEye /> {news.view_count}</span>
          <span>Danh mục: {news.category}</span>
        </div>

        {news.image_url && (
          <div className="news-image">
            <img 
              src={`http://localhost:5000${news.image_url}`} 
              alt={news.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-news.png';
              }}
            />
          </div>
        )}

        <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
      </article>
    </div>
  );
};

export default NewsDetail;
