import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {};
};

// User notifications
const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin notifications
const getAllNotifications = async (page = 1, search = '', type = '') => {
  try {
    const response = await axios.get(`${API_URL}/admin`, {
      headers: getAuthHeader(),
      params: { page, search, type }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createBulkNotifications = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/admin`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteNotification = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteBulkNotifications = async (ids) => {
  try {
    const response = await axios.post(`${API_URL}/admin/delete-bulk`, { ids }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const notificationService = {
  getNotifications,
  markAsRead,
  getAllNotifications,
  createBulkNotifications,
  deleteNotification,
  deleteBulkNotifications
};

export default notificationService; 