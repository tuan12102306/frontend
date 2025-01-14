import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHeart, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import favoriteService from '../../services/favorite.service';
import './FavoriteBooks.css';

const FavoriteBooks = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getFavorites();
      if (response.success) {
        setFavorites(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      setRemoving(bookId);
      const response = await favoriteService.removeFavorite(bookId);
      if (response.success) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
        setFavorites(favorites.filter(book => book.id !== bookId));
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa khỏi yêu thích');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="favorite-books-container">
      <h1>
        <FaHeart className="heart-icon" />
        Sách yêu thích
      </h1>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>Bạn chưa có sách yêu thích nào</p>
          <Link to="/books" className="browse-books-btn">
            Tìm sách ngay
          </Link>
        </div>
      ) : (
        <div className="favorite-books-grid">
          {favorites.map((book) => (
            <div key={book.id} className="favorite-book-card">
              <div className="favorite-book-image">
                {book.image_url ? (
                  <img
                    src={`http://localhost:5000${book.image_url}`}
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-book.png';
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <FaBook size={40} />
                  </div>
                )}
                <Link to={`/books/${book.id}`} className="view-details-btn">
                  Xem chi tiết
                </Link>
              </div>

              <div className="favorite-book-info">
                <h3>{book.title}</h3>
                <p className="author">Tác giả: {book.author}</p>
                <p className="category">Thể loại: {book.category}</p>
                <div className={`availability ${book.available_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {book.available_quantity > 0 
                    ? `${book.available_quantity} cuốn có sẵn` 
                    : 'Hết sách'}
                </div>
                <button
                  className={`remove-favorite-btn ${removing === book.id ? 'removing' : ''}`}
                  onClick={() => handleRemoveFavorite(book.id)}
                  disabled={removing === book.id}
                >
                  {removing === book.id ? (
                    'Đang xóa...'
                  ) : (
                    <>
                      <FaTimes /> Xóa khỏi yêu thích
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteBooks; 