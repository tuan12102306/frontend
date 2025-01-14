import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {};
};

const getProfile = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    if (response.data.success && !response.data.data.avatar_url) {
      response.data.data.avatar_url = '/uploads/avatars/default-avatar.png';
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(API_URL, profileData, {
      headers: getAuthHeader()
    });
    
    // Cập nhật thông tin user trong localStorage nếu thành công
    if (response.data.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_URL}/password`, passwordData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateAvatar = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/avatar`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Cập nhật user trong localStorage
    if (response.data.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      user.avatar_url = response.data.data.avatar_url;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar
};

export default profileService;
