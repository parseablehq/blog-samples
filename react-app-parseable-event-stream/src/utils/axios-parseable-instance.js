/**
 * Name:parseableAxiosInstance
 * description: Customize axios instance to send logs to parseable
 */
import axios from "axios";
const parseableURL = "https://demo.parseable.com";

export const parseableAxiosInstance = axios.create({
  baseURL: parseableURL,
});

parseableAxiosInstance.interceptors.request.use(
  (config) => {
    // Alternatively, add to request body
    if (config.method === "post" || config.method === "put") {
      // if you want to send session details
      let user = localStorage.getItem("profile");
      if (user) {
        user = JSON.parse(user);
        config.data = {
          ...config.data,
          user: user.id,
        };
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
