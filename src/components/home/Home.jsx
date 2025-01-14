import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaLaptop, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import newsService from '../../services/news.service';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      image: '/images/library1.jpg',
      title: 'Thư Viện Hiện Đại PTIT',
      description: 'Khám phá kho tàng tri thức với hơn 10,000 đầu sách'
    },
    {
      image: '/images/library2.jpg',
      title: 'Học Tập Không Giới Hạn',
      description: 'Truy cập 24/7 với thư viện điện tử của chúng tôi'
    },
    {
      image: '/images/library3.jpg',
      title: 'Cộng Đồng Học Tập',
      description: 'Kết nối với hàng nghìn độc giả khác'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await newsService.getAllNews({
        page: 1,
        limit: 2,
        status: 'published',
        featured: true
      });
      
      if (response.success) {
        setLatestNews(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch latest news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <div className="slides-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link to="/books" className="cta-button">
                  Khám Phá Ngay <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Dịch Vụ Của Chúng Tôi</h2>
          <p>Trải nghiệm những tính năng tuyệt vời tại thư viện PTIT</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBook />
            </div>
            <h3>Kho Sách Đa Dạng</h3>
            <p>Hơn 10,000 đầu sách từ nhiều lĩnh vực khác nhau</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaLaptop />
            </div>
            <h3>Thư Viện Điện Tử</h3>
            <p>Truy cập và đọc sách online mọi lúc mọi nơi</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Cộng Đồng</h3>
            <p>Tham gia thảo luận và chia sẻ với cộng đồng độc giả</p>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="section-header">
          <h2>Tin Tức Mới Nhất</h2>
          <p>Cập nhật những thông tin mới nhất từ thư viện</p>
        </div>
        <div className="news-grid">
          {loading ? (
            <div className="loading">Đang tải tin tức...</div>
          ) : latestNews.length > 0 ? (
            latestNews.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-image">
                  <img 
                    src={news.thumbnail || '/images/default-news.jpg'} 
                    alt={news.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-news.jpg';
                    }}
                  />
                </div>
                <div className="news-content">
                  <span className="news-date">
                    {new Date(news.published_at).toLocaleDateString('vi-VN')}
                  </span>
                  <h3>{news.title}</h3>
                  <p>{news.content.substring(0, 100)}...</p>
                  <Link to={`/news/${news.id}`} className="read-more">
                    Xem thêm <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-news">Không có tin tức mới</div>
          )}
        </div>
        <div className="view-all-news">
          <Link to="/news" className="view-all-button">
            Xem tất cả tin tức <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
