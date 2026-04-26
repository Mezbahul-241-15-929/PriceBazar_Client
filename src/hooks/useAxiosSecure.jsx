import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'https://price-bazar-server.vercel.app'
})

const useAxiosSecure = () => {

    return axiosSecure;
};

export default useAxiosSecure;