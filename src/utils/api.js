// API utility functions
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8000';

export async function apiRequest(method, endpoint, data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function uploadFile(endpoint, file, additionalData = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data to FormData
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const options = {
    method: 'POST',
    credentials: 'include',
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}

// Helper function to handle API errors
export function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
}

// Helper function to check if response is successful
export function isSuccessResponse(response) {
  return response.status >= 200 && response.status < 300;
}
