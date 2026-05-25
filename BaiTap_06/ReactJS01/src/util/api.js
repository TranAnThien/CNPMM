import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const forgotPasswordApi = (email, newPassword) => {
    const URL_API = "/v1/api/forgot-password";
    const data = { email, newPassword };
    return axios.post(URL_API, data);
}

const getProductsApi = (params = {}) => {
    const URL_API = "/v1/api/products";
    return axios.get(URL_API, { params });
};

const getProductDetailApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}`;
    return axios.get(URL_API);
};

const getTopSellingProductsApi = (limit = 10) => {
    const URL_API = "/v1/api/products/top-selling";
    return axios.get(URL_API, { params: { limit } });
};

const getTopViewedProductsApi = (limit = 10) => {
    const URL_API = "/v1/api/products/top-viewed";
    return axios.get(URL_API, { params: { limit } });
};

export {
    createUserApi,
    loginApi,
    getUserApi,
    forgotPasswordApi,
    getProductsApi,
    getProductDetailApi,
    getTopSellingProductsApi,
    getTopViewedProductsApi
};
