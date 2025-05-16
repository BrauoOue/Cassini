import axios from 'axios';

const axiosSpringInstance = axios.create({
    baseURL: import.meta.env.VITE_API_SPRING_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Inject token
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );
//
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Global error handler
//         if (error.response?.status === 401) {
//             console.warn('Unauthorized! Redirecting to login.');
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosSpringInstance;