import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaSearch, FaTimes, FaBook, FaBell, FaHeart, FaClipboardList, FaBookReader } from 'react-icons/fa';
import authService from '../../services/auth.service';
import bookService from '../../services/book.service';
import NotificationIcon from './NotificationIcon';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Xử lý tìm kiếm với debounce
  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        try {
          const response = await bookService.searchBooks(searchTerm);
          if (response.success) {
            setSearchResults(response.data);
          }
          setIsSearching(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSearchResultClick = (bookId) => {
    navigate(`/books/${bookId}`);
    clearSearch();
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="logo">PTIT</Link>
        <div className="nav-menu">
          <Link to="/home" className={`nav-item ${isActive("/home")}`}>
            Trang chủ
          </Link>
          <Link to="/books" className={`nav-item ${isActive("/books")}`}>
            Sách
          </Link>
          <Link to="/categories" className={`nav-item ${isActive("/categories")}`}>
            Danh mục
          </Link>
          <Link to="/services" className={`nav-item ${isActive("/services")}`}>
            Dịch vụ
          </Link>
          <Link to="/news" className={`nav-item ${isActive("/news")}`}>
            Tin tức
          </Link>
          <Link to="/rules" className={`nav-item ${isActive("/rules")}`}>
            Nội quy
          </Link>
          <Link to="/contact" className={`nav-item ${isActive("/contact")}`}>
            Liên hệ
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearching(true)}
            />
            {searchTerm ? (
              <FaTimes className="search-icon clear" onClick={clearSearch} />
            ) : (
              <FaSearch className="search-icon" />
            )}
          </div>
          {isSearching && (
            <div className="search-dropdown">
              {isLoading ? (
                <div className="search-loading">Đang tìm kiếm...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(book => (
                  <div
                    key={book.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(book.id)}
                  >
                    <img src={`http://localhost:5000${book.image_url}`} alt={book.title} />
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">Không tìm thấy sách</div>
              )}
            </div>
          )}
        </div>

        <div className="nav-icons">
          <Link to="/favorites" className="nav-icon" title="Sách yêu thích">
            <FaHeart />
          </Link>
          <Link to="/my-borrows" className="nav-icon" title="Sách đang mượn">
            <FaBookReader />
          </Link>
          <Link to="/notifications" className="nav-icon" title="Thông báo">
            <NotificationIcon />
          </Link>
          
          <div className="user-profile">
            <FaUser className="icon" />
            <span>{user?.user?.full_name}</span>
          </div>

          {user?.user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="nav-icon admin-icon" title="Quản lý">
              <FaClipboardList />
            </Link>
          )}

          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header; 