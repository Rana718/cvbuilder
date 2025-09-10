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
            const token = await user.getIdToken();
            config.headers["Authorization"] = `Bearer ${token}`;
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
        // Don't auto-redirect on 401 - let components handle it
        return Promise.reject(error);
    }
);

export default axiosInstance;
