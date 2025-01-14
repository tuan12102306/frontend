import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBell, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import notificationService from '../../../services/notification.service';
import './AdminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [pagination, setPagination] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    user_ids: 'all',
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, [page, search, type]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications(page, search, type);
      if (response.success) {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await notificationService.deleteNotification(id);
      if (response.success) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Xóa thông báo thành công');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await notificationService.deleteBulkNotifications(selectedIds);
      if (response.success) {
        setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
        setSelectedIds([]);
        toast.success('Xóa thông báo thành công');
      }
    } catch (error) {
      console.error('Delete bulk notifications error:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await notificationService.createBulkNotifications(newNotification);
      if (response.success) {
        toast.success('Tạo thông báo thành công');
        setShowCreateForm(false);
        setNewNotification({
          user_ids: 'all',
          type: 'info',
          title: '',
          message: ''
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error('Create notification error:', error);
      toast.error('Không thể tạo thông báo');
    }
  };

  return (
    <div className="admin-notifications">
      <div className="notifications-header">
        <h2>Quản Lý Thông Báo</h2>
        <div className="actions">
          <button onClick={() => setShowCreateForm(true)} className="create-btn">
            <FaPlus /> Tạo thông báo mới
          </button>
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="delete-btn">
              <FaTrash /> Xóa ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại</option>
          <option value="info">Thông tin</option>
          <option value="warning">Cảnh báo</option>
          <option value="success">Thành công</option>
        </select>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h3>Tạo Thông Báo Mới</h3>
          <form onSubmit={handleCreate}>
            <select
              value={newNotification.user_ids}
              onChange={(e) => setNewNotification({...newNotification, user_ids: e.target.value})}
            >
              <option value="all">Tất cả người dùng</option>
              {/* Add more options for specific users if needed */}
            </select>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
            >
              <option value="info">Thông tin</option>
              <option value="warning">Cảnh báo</option>
              <option value="success">Thành công</option>
            </select>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newNotification.title}
              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Nội dung"
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Tạo thông báo</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Đang tải thông báo...</div>
      ) : (
        <>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(notification.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, notification.id]);
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== notification.id));
                    }
                  }}
                />
                <div className={`notification-icon ${notification.type}`}>
                  <FaBell />
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <div className="notification-meta">
                    <span>Gửi đến: {notification.user_id ? notification.full_name : 'Tất cả'}</span>
                    <span>{new Date(notification.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(notification.id)} className="delete-btn">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {pagination && (
            <div className="pagination">
              <button 
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                Trang trước
              </button>
              <span>Trang {page} / {pagination.total_pages}</span>
              <button 
                disabled={page === pagination.total_pages}
                onClick={() => setPage(prev => prev + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminNotifications; 