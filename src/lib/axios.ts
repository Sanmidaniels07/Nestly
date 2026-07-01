import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem("social-auth");
    
    if (storage) {
      const parsed = JSON.parse(storage);
      const token = parsed.state?.accessToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  }
);