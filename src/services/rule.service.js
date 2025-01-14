import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rules';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllRules = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getRuleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addRule = async (ruleData) => {
  try {
    const response = await axios.post(API_URL, ruleData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRule = async (id, ruleData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, ruleData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteRule = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ruleService = {
  getAllRules,
  getRuleById,
  addRule,
  updateRule,
  deleteRule
};

export default ruleService;
