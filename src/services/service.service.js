import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllServices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerService = async (serviceId) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { service_id: serviceId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCurrentService = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/current`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createService = async (serviceData) => {
  try {
    const response = await axios.post(API_URL, serviceData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, serviceData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const serviceService = {
  getAllServices,
  getServiceById,
  registerService,
  getCurrentService,
  createService,
  updateService,
  deleteService
};

export default serviceService;
