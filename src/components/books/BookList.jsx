import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/book.service';
import './BookList.css';
import { FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title_asc');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortOption, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = () => {
    let result = [...books];

    // Filtering
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortOption) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'author_asc':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'author_desc':
        result.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case 'year_asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'year_desc':
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    setFilteredBooks(result);
  };

  const getAvailabilityStatus = (available, total) => {
    // Chuyển đổi sang số để đảm bảo so sánh chính xác
    const availableNum = parseInt(available) || 0;
    const totalNum = parseInt(total) || 0;

    if (totalNum === 0) return { class: 'unavailable', text: '0/0' };
    
    const ratio = availableNum / totalNum;
    if (availableNum === 0) {
      return { class: 'unavailable', text: `${availableNum}/${totalNum}` };
    }
    if (ratio <= 0.3) {
      return { class: 'limited', text: `${availableNum}/${totalNum}` };
    }
    return { class: 'available', text: `${availableNum}/${totalNum}` };
  };

  const handleEdit = (bookId) => {
    navigate(`/books/edit/${bookId}`);
  };

  const handleDelete = async (bookId, bookTitle) => {
    // Ngăn chặn sự kiện click lan truyền
    try {
      if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${bookTitle}"?`)) {
        const response = await bookService.deleteBook(bookId);
        if (response.success) {
          toast.success('Xóa sách thành công!');
          // Cập nhật lại danh sách sách ngay lập tức
          setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        } else {
          toast.error(response.message || 'Không thể xóa sách');
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa sách. Vui lòng thử lại!');
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>Danh sách sách</h2>
        {isAdmin && (
          <Link to="/books/add" className="add-book-btn">
            <FaPlus /> Thêm sách mới
          </Link>
        )}
        <div className="book-list-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, tác giả, ISBN, thể loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sort-box">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title_asc">Tên sách (A-Z)</option>
              <option value="title_desc">Tên sách (Z-A)</option>
              <option value="author_asc">Tác giả (A-Z)</option>
              <option value="author_desc">Tác giả (Z-A)</option>
              <option value="year_asc">Năm xuất bản (Cũ nhất)</option>
              <option value="year_desc">Năm xuất bản (Mới nhất)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-info">
                <h3>{book.title}</h3>
                <div className="book-details">
                  <div className="detail-row">
                    <span className="label">Tác giả:</span>
                    <span className="value">{book.author}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">ISBN:</span>
                    <span className="value">{book.isbn}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Thể loại:</span>
                    <span className="value">{book.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">NXB:</span>
                    <span className="value">{book.publisher}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Năm XB:</span>
                    <span className="value">{book.publish_year}</span>
                  </div>
                </div>
                <div className={`availability-badge ${getAvailabilityStatus(book.available_quantity, book.quantity).class}`}>
                  {getAvailabilityStatus(book.available_quantity, book.quantity).text}
                </div>
              </div>

              <div className="book-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => navigate(`/books/${book.id}`)}
                >
                  <FaBook /> Xem chi tiết
                </button>
                
                {isAdmin && (
                  <div className="admin-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => navigate(`/books/edit/${book.id}`)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(book.id, book.title)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            Không tìm thấy sách phù hợp với từ khóa "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
