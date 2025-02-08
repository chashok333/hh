import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BE,
});

axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = localStorage.getItem("accessToken");
    return config;
});

export default { get: axiosInstance.get, post: axiosInstance.post, delete: axiosInstance.delete }