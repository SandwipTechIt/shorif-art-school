import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "http://192.168.0.198:3000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getApi = async (endpoint, query) => {
  try {
    const response = await apiClient.get(endpoint, { params: query });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const postApi = async (endpoint, data, config = {}) => {
  try {
    // If data is FormData, don't set Content-Type header (let browser set it)
    const isFormData = data instanceof FormData;
    const requestConfig = {
      ...config,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...config.headers,
      },
    };
    
    const response = await apiClient.post(endpoint, data, requestConfig);
    return response.data || {};
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const putApi = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data || {};
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteApi = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data || {};
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const messageApi = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
