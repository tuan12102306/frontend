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

const searchBooks = async (keyword = '') => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword }
    });
    // Đảm bảo trả về đúng format dữ liệu
    return {
      success: true,
      data: response.data.data.books || [] // Lấy trực tiếp array books
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      data: []
    };
  }
};

// Admin functions
const addBook = async (bookData) => {
  try {
    const formData = new FormData();
    
    Object.keys(bookData).forEach(key => {
      if (key === 'image' || key === 'preview_pdf') {
        if (bookData[key]) {
          formData.append(key, bookData[key]);
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
    
    Object.keys(bookData).forEach(key => {
      if (key === 'image' || key === 'preview_pdf') {
        if (bookData[key]) {
          formData.append(key, bookData[key]);
        }
      } else if (bookData[key] != null) {
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

// Thêm hàm để lấy URL preview PDF
const getBookPreviewUrl = (bookId) => {
  return `${API_URL}/${bookId}/preview`;
};

// Thêm hàm mới để lấy PDF với CORS
const getBookPreview = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/${bookId}/preview`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  } catch (error) {
    throw error;
  }
};

const getBooksByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books by category:', error);
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
  borrowBook,
  getBookPreviewUrl,
  getBookPreview,
  getBooksByCategory
};

export default bookService;
