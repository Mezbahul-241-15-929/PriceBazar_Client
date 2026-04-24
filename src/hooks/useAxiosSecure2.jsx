import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
})

const useAxiosSecure2 = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // intercept request to add JWT token
        const reqInterceptor = axiosSecure.interceptors.request.use(config => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })

        // interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            console.log('Axios error:', error);

            const statusCode = error.response?.status; 
            if (statusCode === 401 || statusCode === 403) {
                logOut()
                    .then(() => {
                        navigate('/login')
                    })
            }

            return Promise.reject(error);
        })

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }

    }, [logOut, navigate])

    return axiosSecure;
};

export default useAxiosSecure2;