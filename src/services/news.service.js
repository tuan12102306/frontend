import axios from 'axios';

const API_URL = 'http://localhost:5000/api/news';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllNews = async (params = {}) => {
  try {
    const { page = 1, limit = 10, category, status = 'published', featured } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (category) queryParams.append('category', category);
    if (status) queryParams.append('status', status);
    if (featured !== undefined) queryParams.append('featured', featured);

    const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
    console.log('API Response:', response.data); // Để debug
    return response.data;
  } catch (error) {
    console.error('getAllNews error:', error);
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
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateNews = async (id, newsData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, newsData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
