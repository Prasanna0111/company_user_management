import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      const { status, data } = error.response;

      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else {
        switch (status) {
          case 400:
            errorMessage = "Bad request. Please check your input.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please log in again.";
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = "The requested resource was not found.";
            break;
          case 409:
            errorMessage =
              "A conflict occurred. The resource may already exist.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error: ${status}`;
        }
      }
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = error.message || "Failed to make request";
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  },
);
