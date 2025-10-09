import axios from "axios";
import { auth } from "./firebase";

const api_key = process.env.NEXT_PUBLIC_API_KEY;

const axiosInstance = axios.create({
    baseURL: api_key || "http://localhost:8000"
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const token = await user.getIdToken();
                config.headers["Authorization"] = `Bearer ${token}`;
            } catch (error) {
                console.error('Failed to get auth token:', error);
                // Continue without token - let the API handle the 401
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If it's a 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const user = auth.currentUser;
            if (user) {
                try {
                    // Force refresh the token
                    const token = await user.getIdToken(true);
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    
                    // Retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Fall through to reject the original error
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
