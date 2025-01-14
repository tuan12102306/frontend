import axios from 'axios';

const API_URL = 'http://localhost:5000/api/borrows';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {};
};

const getUserBorrows = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-borrows`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createBorrow = async (bookId) => {
  try {
    const response = await axios.post(API_URL, 
      { book_id: bookId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const returnBorrow = async (borrowId) => {
  try {
    console.log('Returning borrow with ID:', borrowId);
    const response = await axios.post(
      `${API_URL}/return/${borrowId}`,
      {},
      { headers: getAuthHeader() }
    );
    console.log('Return response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Return error:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'Lỗi server khi trả sách' };
  }
};

const borrowService = {
  getUserBorrows,
  createBorrow,
  returnBorrow
};

export default borrowService;