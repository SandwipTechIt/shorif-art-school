import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.0.200:3000/",
  headers: {
    "Content-Type": "application/json",
  },
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

export const postApi = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
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
