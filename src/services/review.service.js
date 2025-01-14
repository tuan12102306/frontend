import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getBookReviews = async (bookId, params = {}) => {
  try {
    const { page = 1, limit = 5 } = params;
    const response = await axios.get(
      `${API_URL}/book/${bookId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addReview = async (bookId, reviewData) => {
  try {
    const response = await axios.post(
      `${API_URL}/book/${bookId}`,
      reviewData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${reviewId}`,
      reviewData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${reviewId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserReviews = async (params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await axios.get(
      `${API_URL}/my-reviews?page=${page}&limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reviewService = {
  getBookReviews,
  addReview,
  updateReview,
  deleteReview,
  getUserReviews
};

export default reviewService;
