import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import reviewService from '../../services/review.service';
import './ReviewSection.css';

const ReviewSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    total_pages: 0
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchReviews();
  }, [bookId, pagination.page]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getBookReviews(bookId, pagination);
      setReviews(response.data.reviews);
      setAverageRating(response.data.average_rating);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        total_pages: response.data.pagination.total_pages
      }));
    } catch (error) {
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }

    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, { rating, comment });
        toast.success('Cập nhật đánh giá thành công');
        setEditingReview(null);
      } else {
        await reviewService.addReview(bookId, { rating, comment });
        toast.success('Đánh giá thành công');
      }
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thực hiện đánh giá');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to form
    document.querySelector('.review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setComment('');
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success('Xóa đánh giá thành công');
        fetchReviews();
      } catch (error) {
        toast.error('Không thể xóa đánh giá');
      }
    }
  };

  const renderStars = (currentRating, isInput = false) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${
              isInput
                ? (star <= (hoveredRating || rating) ? 'active' : '')
                : (star <= currentRating ? 'active' : '')
            }`}
            onClick={isInput ? () => setRating(star) : undefined}
            onMouseEnter={isInput ? () => setHoveredRating(star) : undefined}
            onMouseLeave={isInput ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="review-section">
      <h3>Đánh giá sách</h3>
      
      <div className="average-rating">
        {renderStars(Math.round(averageRating || 0))}
        <span className="rating-text">
          {Number(averageRating || 0).toFixed(1)}/5 ({reviews.length} đánh giá)
        </span>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>{editingReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}</h4>
          <div className="rating-input">
            {renderStars(rating, true)}
            <span className="rating-label">
              {rating > 0 ? `Bạn đã chọn: ${rating} sao` : 'Chọn số sao'}
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập nhận xét của bạn..."
            required
          />
          <div className="form-buttons">
            {editingReview && (
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                Hủy
              </button>
            )}
            <button type="submit" className="submit-button" disabled={!rating}>
              {editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="user-info">
                <img 
                  src={review.user_avatar ? 
                    `http://localhost:5000${review.user_avatar}` : 
                    `http://localhost:5000/uploads/avatars/default-avatar.jpg`
                  } 
                  alt="User avatar" 
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `http://localhost:5000/uploads/avatars/default-avatar.jpg`;
                  }}
                />
                <div className="user-review-info">
                  <strong>{review.user_name}</strong>
                  {renderStars(review.rating)}
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
              {user?.user?.id === review.user_id && (
                <div className="review-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(review)}
                    title="Sửa đánh giá"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(review.id)}
                    title="Xóa đánh giá"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            <p className="review-comment">{review.comment}</p>
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

export default ReviewSection;
