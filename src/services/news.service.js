import axios from 'axios';

const API_URL = 'http://localhost:5000/api/news';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllNews = async (params = {}) => {
  try {
    const { page = 1, limit = 10, category, status, featured } = params;
    const response = await axios.get(
      `${API_URL}?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}${featured !== undefined ? `&featured=${featured}` : ''}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addNews = async (newsData) => {
  try {
    const response = await axios.post(API_URL, newsData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateNews = async (id, newsData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, newsData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const newsService = {
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  deleteNews
};

export default newsService;
