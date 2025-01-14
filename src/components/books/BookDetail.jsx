import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaHeart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Document, Page, pdfjs } from 'react-pdf';
import bookService from '../../services/book.service';
import borrowService from '../../services/borrow.service';
import favoriteService from '../../services/favorite.service';
import ReviewSection from './ReviewSection';
import './BookDetail.css';

// Cấu hình PDF worker - cách mới
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [currentBorrow, setCurrentBorrow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteProcessing, setFavoriteProcessing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(null);

  const fetchBookData = async () => {
    try {
      const bookResponse = await bookService.getBookById(id);
      if (bookResponse.success) {
        setBook(bookResponse.data);
      }
      return bookResponse;
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Không thể tải thông tin sách');
      throw error;
    }
  };

  const fetchBorrowStatus = async () => {
    if (!user) return null;
    
    try {
      const borrowResponse = await borrowService.getUserBorrows();
      if (borrowResponse.success) {
        const activeBorrow = borrowResponse.data.find(
          borrow => borrow.book_id === parseInt(id) && borrow.status === 'borrowed'
        );
        setCurrentBorrow(activeBorrow || null);
      }
      return borrowResponse;
    } catch (error) {
      console.error('Error fetching borrow status:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchBookData(),
          fetchBorrowStatus()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    try {
      setFavoriteProcessing(true);
      const response = await (isFavorite 
        ? favoriteService.removeFavorite(id)
        : favoriteService.addFavorite(id)
      );

      if (response.success) {
        setIsFavorite(!isFavorite);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setFavoriteProcessing(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mượn sách');
      return;
    }

    try {
      setBorrowing(true);
      const response = await borrowService.createBorrow(id);
      if (response.success) {
        const borrowResponse = await borrowService.getUserBorrows();
        if (borrowResponse.success) {
          const activeBorrow = borrowResponse.data.find(
            borrow => borrow.book_id === parseInt(id) && borrow.status === 'borrowed'
          );
          setCurrentBorrow(activeBorrow || null);
        }
        const bookResponse = await bookService.getBookById(id);
        if (bookResponse.success) {
          setBook(bookResponse.data);
        }
        toast.success('Mượn sách thành công');
      }
    } catch (error) {
      toast.error(error.message || 'Không thể mượn sách');
    } finally {
      setBorrowing(false);
    }
  };

  const handleReturn = async () => {
    if (!currentBorrow) {
      toast.error('Không tìm thấy thông tin mượn sách');
      return;
    }

    try {
      console.log('Attempting to return book, borrow ID:', currentBorrow.id); // Debug log
      setBorrowing(true);
      
      const response = await borrowService.returnBorrow(currentBorrow.id);
      console.log('Return response:', response); // Debug log
      
      if (response.success) {
        toast.success('Trảả sách thành công');
        setCurrentBorrow(null);
        // Cập nhật lại thông tin sách
        await fetchBookData();
        await fetchBorrowStatus();
      }
    } catch (error) {
      console.error('Return book error:', error);
      toast.error(error.message || 'Không thể trả sách. Vui lòng thử lại');
    } finally {
      setBorrowing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      try {
        const response = await bookService.deleteBook(id);
        if (response.success) {
          toast.success('Xóa sách thành công!');
          navigate('/books');
        } else {
          toast.error(response.message || 'Không thể xóa sách');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Không thể xóa sách. Vui lòng thử lại!');
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError(error);
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading">Đang tải thông tin sách...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-container">
        <div className="error">Không tìm thấy sách</div>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <Link to="/books" className="back-button">
        <FaArrowLeft /> Quay lại danh sách
      </Link>

      <div className="book-detail-content">
        <div className="book-detail-image">
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
              <FaBook size={60} />
            </div>
          )}
        </div>

        <div className="book-detail-info">
          <h1>{book.title}</h1>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Tác giả</label>
              <span>{book.author || 'Chưa cập nhật'}</span>
            </div>
            
            <div className="info-item">
              <label>ISBN</label>
              <span>{book.isbn || 'Chưa cập nhật'}</span>
            </div>
            
            <div className="info-item">
              <label>Thể loại</label>
              <span>{book.category || 'Chưa cập nhật'}</span>
            </div>
            
            <div className="info-item">
              <label>Nhà xuất bản</label>
              <span>{book.publisher || 'Chưa cập nhật'}</span>
            </div>
            
            <div className="info-item">
              <label>Năm xuất bản</label>
              <span>{book.publish_year || 'Chưa cập nhật'}</span>
            </div>
            
            <div className="info-item">
              <label>Tình trạng</label>
              <span className={`availability ${book.available_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {book.available_quantity} / {book.quantity} cuốn có sẵn
              </span>
            </div>
          </div>

          {book.description && (
            <div className="book-description">
              <h2>Mô tả</h2>
              <p>{book.description}</p>
            </div>
          )}

          {user && (
            <div className="book-actions">
              <div className="action-buttons">
                {currentBorrow ? (
                  <button 
                    className={`return-button ${borrowing ? 'processing' : ''}`}
                    onClick={handleReturn}
                    disabled={borrowing}
                  >
                    {borrowing ? 'Đang xử lý...' : 'Trả sách'}
                  </button>
                ) : (
                  book.available_quantity > 0 && (
                    <button 
                      className={`borrow-button ${borrowing ? 'borrowing' : ''}`}
                      onClick={handleBorrow}
                      disabled={borrowing}
                    >
                      {borrowing ? 'Đang xử lý...' : 'Mượn sách'}
                    </button>
                  )
                )}
                
                <button 
                  className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                  onClick={handleFavoriteToggle}
                  disabled={favoriteProcessing}
                >
                  <FaHeart className={isFavorite ? 'heart-filled' : ''} />
                  {favoriteProcessing 
                    ? 'Đang xử lý...' 
                    : (isFavorite 
                      ? 'Bỏ yêu thích' 
                      : 'Yêu thích'
                    )
                  }
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="admin-actions">
              <button 
                className="delete-book-btn"
                onClick={handleDelete}
              >
                <FaTrash /> Xóa sách
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phần đánh giá sách */}
      <div className="book-reviews">
        <ReviewSection bookId={id} />
      </div>

      {book.preview_pdf && (
        <div className="book-preview-section">
          <h2>Xem trước sách</h2>
          <div className="pdf-viewer">
            <Document
              file={`http://localhost:5000${book.preview_pdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div>Đang tải PDF...</div>}
              options={{
                cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/'
              }}
            >
              {numPages && (
                <Page 
                  pageNumber={pageNumber} 
                  width={Math.min(600, window.innerWidth - 32)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div>Đang tải trang...</div>}
                />
              )}
            </Document>
            {numPages && (
              <div className="pdf-navigation">
                <p>Trang {pageNumber} trên {numPages}</p>
                <div className="pdf-controls">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    Trang trước
                  </button>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
