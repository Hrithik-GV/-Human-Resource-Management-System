// Simulated API Client for Future Integration
const API_BASE_URL = "http://localhost:5000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Request Failed" }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

export const api = {
  get: async (endpoint, token) => {
    // Return placeholder or execute fetch when connected
    // return fetch(`${API_BASE_URL}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } }).then(handleResponse);
    console.log(`[API GET] ${endpoint}`);
    return null;
  },
  post: async (endpoint, body, token) => {
    console.log(`[API POST] ${endpoint}`, body);
    return null;
  },
  put: async (endpoint, body, token) => {
    console.log(`[API PUT] ${endpoint}`, body);
    return null;
  },
  delete: async (endpoint, token) => {
    console.log(`[API DELETE] ${endpoint}`);
    return null;
  }
};

export default api;
