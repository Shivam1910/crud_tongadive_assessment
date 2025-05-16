import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dataService = {
  // Create multiple records
  bulkCreate: async (records) => {
    const response = await api.post("/data/bulk", { records });
    return response.data;
  },

  // Get all records with pagination
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get("/data", {
      params: { page, limit },
    });
    return response.data;
  },

  // Update multiple records
  bulkUpdate: async (records) => {
    const response = await api.put("/data/bulk", { records });
    return response.data;
  },

  // Delete multiple records
  bulkDelete: async (ids) => {
    const response = await api.delete("/data/bulk", {
      data: { ids },
    });
    return response.data;
  },

  // Get a single record
  getOne: async (id) => {
    const response = await api.get(`/data/${id}`);
    return response.data;
  },

  // Update a single record
  updateOne: async (id, data) => {
    const response = await api.put(`/data/${id}`, data);
    return response.data;
  },

  // Delete a single record
  deleteOne: async (id) => {
    const response = await api.delete(`/data/${id}`);
    return response.data;
  },
};

export default api;

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);
