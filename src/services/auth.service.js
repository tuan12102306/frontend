import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (email, phone, password, full_name) => {
  const response = await axios.post(API_URL + 'register', {
    email,
    phone,
    password,
    full_name
  });
  return response.data;
};

const login = async (login_id, password) => {
  const response = await axios.post(API_URL + 'login', {
    login_id,
    password
  });
  if (response.data.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout
};

export default authService;
