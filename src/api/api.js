import axios from 'axios';

// Configure API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;
const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 10000; // 10 seconds default


// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(API_TIMEOUT), // Ensure timeout is a number
});

// Request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const { status, data } = error.response;
      
      if (status === 401) {
        // Auto logout if 401 Unauthorized response
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
      
      const errorMessage = data?.message || error.message;
      return Promise.reject({
        message: errorMessage,
        status,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'No response from server',
        status: null,
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message,
        status: null,
      });
    }
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  throw error; // Re-throw to let calling code handle it
};

// User APIs
export const registerUser = async (userData) => {
  try {
    return await api.post('/users/register', userData);
  } catch (error) {
    return handleApiError(error);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/users/login', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProfile = async () => {
  try {
    return await api.get('/users/profile');
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  // Optional: You might want to call a logout API endpoint here
  // return api.post('/users/logout');
};

// Event APIs
export const createEvent = async (eventData) => {
  try {
    return await api.post('/events', eventData);
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    return await api.put(`/events/${id}`, eventData);
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEvent = async (id) => {
  try {
    return await api.delete(`/events/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEvents = async () => {
  try {
    return await api.get('/events');
  } catch (error) {
    return handleApiError(error);
  }
};

// Optional: Request cancellation
export const createCancelToken = () => {
  return axios.CancelToken.source();
};