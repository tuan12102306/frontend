import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaKey, FaEdit, FaSave, FaCamera, FaHistory, FaSignInAlt, FaSignOutAlt, FaBook, FaBookReader, FaHeart, FaHeartBroken, FaCircle } from 'react-icons/fa';
import profileService from '../../services/profile.service';
import activityService from '../../services/activity.service';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [activities, setActivities] = useState([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPagination, setActivityPagination] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab, activityPage]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      if (response.success) {
        setProfile(response.data);
        setEditForm({
          full_name: response.data.full_name || '',
          phone: response.data.phone || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      setError(null);
      const response = await activityService.getActivities(activityPage);
      if (response.success) {
        setActivities(response.data.activities);
        setActivityPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch activities error:', error);
      setError('Không thể tải lịch sử hoạt động');
      toast.error('Không thể tải lịch sử hoạt động');
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dữ liệu
    if (!editForm.full_name || !editForm.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate số điện thoại
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(editForm.phone)) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    try {
      const response = await profileService.updateProfile(editForm);
      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        setIsEditing(false);
        // Cập nhật lại thông tin profile
        setProfile(prev => ({
          ...prev,
          ...response.data
        }));
        // Cập nhật form
        setEditForm({
          full_name: response.data.full_name,
          phone: response.data.phone
        });
      }
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await profileService.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      if (response.success) {
        toast.success('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return `http://localhost:5000/uploads/avatars/default-avatar.jpg`;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath}`;
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh không được quá 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await profileService.updateAvatar(formData);
      
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          avatar_url: response.data.avatar_url
        }));
        toast.success('Cập nhật avatar thành công');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      toast.error('Không thể cập nhật avatar');
    } finally {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      'FaSignInAlt': FaSignInAlt,
      'FaSignOutAlt': FaSignOutAlt,
      'FaUserEdit': FaEdit,
      'FaKey': FaKey,
      'FaCamera': FaCamera,
      'FaBook': FaBook,
      'FaBookReader': FaBookReader,
      'FaHeart': FaHeart,
      'FaHeartBroken': FaHeartBroken,
      'FaCircle': FaCircle
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent /> : <FaCircle />;
  };

  const getActivityDescription = (activity) => {
    const descriptions = {
      'login': 'Đăng nhập vào hệ thống',
      'logout': 'Đăng xuất khỏi hệ thống',
      'profile_update': 'Cập nhật thông tin cá nhân',
      'password_change': 'Thay đổi mật khẩu',
      'avatar_update': 'Cập nhật ảnh đại diện',
      'borrow_book': `Mượn sách "${activity.metadata?.book_title || ''}"`,
      'return_book': `Trả sách "${activity.metadata?.book_title || ''}"`,
      'add_favorite': `Thêm sách "${activity.metadata?.book_title || ''}" vào yêu thích`,
      'remove_favorite': `Xóa sách "${activity.metadata?.book_title || ''}" khỏi yêu thích`
    };
    return descriptions[activity.action] || activity.description;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2><FaUser /> Thông tin cá nhân</h2>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={avatarPreview || getAvatarUrl(profile?.avatar_url)}
              alt="Avatar" 
              className="avatar-image"
              onError={(e) => {
                if (e.target.src !== `http://localhost:5000/uploads/avatars/default-avatar.jpg`) {
                  e.target.src = `http://localhost:5000/uploads/avatars/default-avatar.jpg`;
                }
              }}
            />
            <label className="avatar-upload">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="profile-section">
          <h3>Profile Information</h3>
          {!isEditing ? (
            <div className="profile-info">
              <p><strong>Full Name:</strong> {profile?.full_name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
              <p><strong>Role:</strong> {profile?.role}</p>
              <p><strong>Member Since:</strong> {new Date(profile?.created_at).toLocaleDateString()}</p>
              
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-section">
          <h3>Change Password</h3>
          <button 
            className="change-password-button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <FaKey /> {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                <FaKey /> Update Password
              </button>
            </form>
          )}
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <FaHistory /> Activities
          </button>
        </div>

        {activeTab === 'activities' && (
          <div className="activities-section">
            <h3>Lịch sử hoạt động</h3>
            
            {loadingActivities ? (
              <div className="loading-activities">
                <div className="spinner"></div>
                <p>Đang tải lịch sử hoạt động...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchActivities}>Thử lại</button>
              </div>
            ) : activities.length > 0 ? (
              <>
                <div className="activities-list">
                  {activities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.action}`}>
                        {getIconComponent(activity.icon)}
                      </div>
                      <div className="activity-content">
                        <p className="activity-description">
                          {getActivityDescription(activity)}
                        </p>
                        <p className="activity-time">
                          {activity.timeAgo}
                          {activity.ip_address && (
                            <span className="activity-ip"> - IP: {activity.ip_address}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {activityPagination && (
                  <div className="pagination">
                    <button 
                      disabled={activityPage === 1}
                      onClick={() => setActivityPage(prev => prev - 1)}
                    >
                      Trang trước
                    </button>
                    <span>
                      Trang {activityPage} / {activityPagination.total_pages}
                    </span>
                    <button 
                      disabled={activityPage === activityPagination.total_pages}
                      onClick={() => setActivityPage(prev => prev + 1)}
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-activities">
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
