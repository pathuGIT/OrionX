import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:8000/api', // Backend base URL
});

//Attach token to requests if available
Api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("lsls");
    return config;
});

Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('Interceptor triggered');
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('401 error detected');
            originalRequest._retry = true;

            try {
                console.log('Attempting to refresh token');
                // Request a new access token using the refresh token
                const { data } = await axios.post('http://localhost:8000/api/auth/refresh', {
                    useremail: sessionStorage.getItem('credential'),
                    id: sessionStorage.getItem('id'),
                    role: sessionStorage.getItem('role'),
                    refreshKey: sessionStorage.getItem('refreshToken'),
                });
                //Save the new access token
                sessionStorage.setItem('token', data.token);

                //Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                console.log("gini:::::" + originalRequest);
                return Api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token expired or invalid');
                // Redirect to login page or handle logout
                //window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default Api;