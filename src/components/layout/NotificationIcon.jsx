import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import notificationService from '../../services/notification.service';
import './NotificationIcon.css';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Polling mỗi 1 phút
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationStyle = (type) => {
    switch(type) {
        case 'new_book':
            return { backgroundColor: '#28a745' };
        case 'due_soon':
            return { backgroundColor: '#ffc107' };
        case 'overdue':
            return { backgroundColor: '#dc3545' };
        case 'low_stock':
            return { backgroundColor: '#17a2b8' };
        case 'borrow':
            return { backgroundColor: '#007bff' };
        case 'return':
            return { backgroundColor: '#6f42c1' };
        default:
            return { backgroundColor: '#007bff' };
    }
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <div 
        className="notification-icon" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            <Link to="/notifications" onClick={() => setShowDropdown(false)}>
              Xem tất cả
            </Link>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">Không có thông báo mới</p>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-header">
                      <span 
                        className="notification-type-badge"
                        style={getNotificationStyle(notification.type)}
                      >
                        {notification.type}
                      </span>
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon; 