import { apiClient } from "../api/apiClient";

export const locationService = {
  getCountries: async () => {
    const response = await apiClient.get("/locations/countries");
    return response.data;
  },

  getStates: async (countryId) => {
    const response = await apiClient.get(`/locations/states/${countryId}`);
    return response.data;
  },

  getCities: async (stateId) => {
    const response = await apiClient.get(`/locations/cities/${stateId}`);
    return response.data;
  },
};
