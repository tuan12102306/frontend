import axios from 'axios';

const API_URL = 'http://localhost:5000/api/favorites';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {};
};

const addFavorite = async (bookId) => {
  try {
    const response = await axios.post(API_URL, { book_id: bookId }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const removeFavorite = async (bookId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const checkFavorite = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/check/${bookId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getFavorites = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const favoriteService = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavorites
};

export default favoriteService; 