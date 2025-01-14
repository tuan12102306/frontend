import axios from 'axios';

const API_URL = 'http://localhost:5000/api/activities';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {};
};

// Thêm mapping cho các loại hoạt động
const activityIcons = {
  'login': 'FaSignInAlt',
  'logout': 'FaSignOutAlt',
  'profile_update': 'FaUserEdit',
  'password_change': 'FaKey',
  'avatar_update': 'FaCamera',
  'borrow_book': 'FaBook',
  'return_book': 'FaBookReader',
  'add_favorite': 'FaHeart',
  'remove_favorite': 'FaHeartBroken'
};

const getActivityIcon = (action) => {
  return activityIcons[action] || 'FaCircle';
};

const formatActivityTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Nếu dưới 24h, hiển thị giờ trước
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} giờ trước`;
  }
  
  // Nếu dưới 30 ngày, hiển thị ngày trước
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} ngày trước`;
  }

  // Nếu trên 30 ngày, hiển thị ngày tháng
  return date.toLocaleDateString('vi-VN');
};

const getActivities = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: getAuthHeader()
    });
    return {
      ...response.data,
      data: {
        ...response.data.data,
        activities: response.data.data.activities.map(activity => ({
          ...activity,
          icon: getActivityIcon(activity.action),
          timeAgo: formatActivityTime(activity.created_at)
        }))
      }
    };
  } catch (error) {
    throw error;
  }
};

const activityService = {
  getActivities,
  getActivityIcon
};

export default activityService; 