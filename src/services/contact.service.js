import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contacts';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const createContact = async (contactData) => {
  try {
    const response = await axios.post(API_URL, contactData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllContacts = async (page = 1, limit = 10, status = '') => {
  try {
    const response = await axios.get(
      `${API_URL}?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const respondToContact = async (id, response) => {
  try {
    const result = await axios.put(
      `${API_URL}/${id}/respond`,
      { response },
      { headers: getAuthHeader() }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-contacts`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const contactService = {
  createContact,
  getAllContacts,
  respondToContact,
  deleteContact,
  getMyContacts
};

export default contactService;
