/**
 * Name:parseableAxiosInstance
 * description: Customize axios instance to send logs to parseable
 */
import axios from "axios";
const backend_URL = "http://localhost:4444"; // Replace with your backend URL

const axiosHTTPClient = axios.create({
  baseURL: backend_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Log-Source": "ReactApp", // Custom header for log analysis
  },
});

axiosHTTPClient.interceptors.request.use(
  (config) => {
    // Alternatively, if you want to add some global data like Session etc
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
