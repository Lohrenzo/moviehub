import axios from "axios";

export default axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const axiosPrivate = axios.create({
  // Attach interceptors to the axios
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});
