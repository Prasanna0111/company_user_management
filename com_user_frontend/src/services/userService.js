import { apiClient } from "../api/apiClient";

export const userService = {
  getUsersByCompany: async (companyId) => {
    const response = await apiClient.get(`/companies/${companyId}/users`);
    return response.data;
  },
  getAllUsers: async (filters = {}) => {
    const response = await apiClient.post("/users", filters);
    return response.data;
  },

  migrateUser: async (userId, companyId) => {
    const response = await apiClient.patch(`/users/${userId}/migrate`, {
      companyId,
    });
    return response.data;
  },
  unassignUser: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/migrate`, {
      companyId: null,
    });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/users/add", userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  migrateUser: async (userId, targetCompanyId) => {
    const response = await apiClient.patch(`/users/${userId}/migrate`, {
      companyId: targetCompanyId,
    });
    return response.data;
  },
};
