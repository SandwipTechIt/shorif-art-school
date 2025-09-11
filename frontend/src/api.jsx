import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.shorifartschool.com",
  // baseURL: "http://192.168.0.200:5000",
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

// Gallery Image Upload API
export const uploadGalleryImages = async (files, onProgress = null) => {
  try {
    const formData = new FormData();
    
    // Append all files to FormData
    files.forEach((file, index) => {
      formData.append('image', file);
    });


    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };

    const response = await postApi('addGallery', formData, config);
    return response;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw {
        type: 'SERVER_ERROR',
        status,
        message: data?.message || `Server error: ${status}`,
        details: data?.details || null,
      };
    } else if (error.request) {
      // Network error
      throw {
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.',
        details: error.message,
      };
    } else {
      // Other error
      throw {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during upload.',
        details: error.message,
      };
    }
  }
};

// Gallery Images API Functions
export const getAllGalleryImages = async () => {
  try {
    const response = await getApi('getAllGallery');
    return response;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        type: 'SERVER_ERROR',
        status,
        message: data?.message || `Failed to fetch gallery images: ${status}`,
        details: data?.details || null,
      };
    } else if (error.request) {
      throw {
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.',
        details: error.message,
      };
    } else {
      throw {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred while fetching images.',
        details: error.message,
      };
    }
  }
};

export const deleteGalleryImage = async (imageId) => {
  try {
    if (!imageId) {
      throw {
        type: 'VALIDATION_ERROR',
        message: 'Image ID is required for deletion.',
      };
    }

    const response = await deleteApi(`deleteGallery/${imageId}`);
    return response;
  } catch (error) {
    if (error.type === 'VALIDATION_ERROR') {
      throw error;
    }
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 404) {
        throw {
          type: 'NOT_FOUND_ERROR',
          status,
          message: 'Image not found or already deleted.',
          details: data?.details || null,
        };
      } else if (status === 403) {
        throw {
          type: 'PERMISSION_ERROR',
          status,
          message: 'You do not have permission to delete this image.',
          details: data?.details || null,
        };
      } else {
        throw {
          type: 'SERVER_ERROR',
          status,
          message: data?.message || `Failed to delete image: ${status}`,
          details: data?.details || null,
        };
      }
    } else if (error.request) {
      throw {
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.',
        details: error.message,
      };
    } else {
      throw {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred while deleting the image.',
        details: error.message,
      };
    }
  }
};
