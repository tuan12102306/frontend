import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

// Helper function để lấy token
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchBooks = async (keyword = '', page = 1, limit = 12) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin functions
const addBook = async (bookData) => {
  try {
    const formData = new FormData();
    
    // Thêm các trường thông tin sách vào FormData
    Object.keys(bookData).forEach(key => {
      if (key === 'image') {
        if (bookData[key]) {
          formData.append('image', bookData[key]);
        }
      } else {
        formData.append(key, bookData[key].toString());
      }
    });

    const response = await axios.post(API_URL, formData, {
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

const updateBook = async (id, bookData) => {
  try {
    const formData = new FormData();
    
    // Thêm các trường thông tin sách vào FormData
    Object.keys(bookData).forEach(key => {
      // Bỏ qua các trường undefined/null trừ trường image
      if (key === 'image') {
        if (bookData[key]) {
          formData.append('image', bookData[key]);
        }
      } else if (bookData[key] != null) { // Chỉ thêm các giá trị không null
        formData.append(key, bookData[key].toString());
      }
    });

    const response = await axios.put(`${API_URL}/${id}`, formData, {
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

const deleteBook = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 500) {
      throw {
        success: false,
        message: 'Không thể xóa sách. Vui lòng thử lại sau.'
      };
    }
    throw error.response?.data || error;
  }
};

const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const borrowBook = async (bookId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${bookId}/borrow`,
      {},
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const bookService = {
  getAllBooks,
  searchBooks,
  addBook,
  updateBook,
  deleteBook,
  getBookById,
  borrowBook
};

export default bookService;
