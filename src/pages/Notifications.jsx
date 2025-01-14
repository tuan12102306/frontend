import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import notificationService from '../services/notification.service';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch(type) {
        case 'new_book':
            return 'Sách mới';
        case 'due_soon':
            return 'Sắp đến hạn';
        case 'overdue':
            return 'Quá hạn';
        case 'low_stock':
            return 'Sắp hết';
        case 'borrow':
            return 'Mượn sách';
        case 'return':
            return 'Trả sách';
        default:
            return type;
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="notifications-page">
      <h2>Tất cả thông báo</h2>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">Không có thông báo nào</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-card ${!notification.is_read ? 'unread' : ''} ${notification.type}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-type">
                    {getNotificationTypeLabel(notification.type)}
                  </span>
                  <span className="notification-date">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 