import { apiClient } from "../api/apiClient";

export const companyService = {
  getCompanies: async (filters = {}) => {
    const response = await apiClient.post("/companies", filters);
    return response.data;
  },

  getCompaniesWithoutPagination: async () => {
    const response = await apiClient.get("/companies/all");
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData) => {
    const response = await apiClient.post("/companies/create", companyData);
    return response.data;
  },

  updateCompany: async (id, companyData) => {
    const response = await apiClient.patch(`/companies/${id}`, companyData);
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await apiClient.delete(`/companies/${id}`);
    return response.data;
  },

  addUserToCompany: async (id, userData) => {
    const response = await apiClient.post(`/companies/${id}/users`, userData);
    return response.data;
  },
};
