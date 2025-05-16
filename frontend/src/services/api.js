import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dataService = {
  // Get all records with pagination
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get("/data", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  // Bulk create records
  bulkCreate: async (records) => {
    try {
      const response = await api.post("/data/bulk", { records });
      return response.data;
    } catch (error) {
      console.error("Error creating records:", error);
      throw error;
    }
  },

  // Bulk update records
  bulkUpdate: async (records) => {
    try {
      const response = await api.put("/data/bulk", { records });
      return response.data;
    } catch (error) {
      console.error("Error updating records:", error);
      throw error;
    }
  },

  // Bulk delete records
  bulkDelete: async (ids) => {
    try {
      const response = await api.delete("/data/bulk", {
        data: { ids },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting records:", error);
      throw error;
    }
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
