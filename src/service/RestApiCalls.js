import {APP_CLIENT_ID, APP_CLIENT_SECRET, BACKEND_API_GATEWAY_URL} from '../constants/appConstants';
import axios from 'axios';
import qs from 'qs';
import store from '../store';
import {USER_LOGOUT} from '../constants/userConstants';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response.status === 401 && originalRequest.url.includes('grant_type=refresh_token')) {
            localStorage.clear();
            store.dispatch({
                type: USER_LOGOUT
            });
            return Promise.reject(error);
        }

        if (error.response.status === 401) {
            console.log('Refreshing Token');
            const refreshToken = JSON.parse(localStorage.getItem('userInfo'))?.refresh_token;
            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);

                const axiosConfig = {
                    headers: {
                        Authorization: 'Basic ' + btoa(APP_CLIENT_ID + ':' + APP_CLIENT_SECRET),
                        'Content-Type': 'application/json'
                    }
                };

                if (tokenParts.exp > now) {
                    return axios
                        .post(
                            `${BACKEND_API_GATEWAY_URL}/account/oauth/token?refresh_token=${refreshToken}`,
                            null,
                            axiosConfig
                        )
                        .then((response) => {
                            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                            const updatedUserInfo = {
                                ...userInfo,
                                token: response.data.access_token
                            };
                            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                            axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.access_token;
                            originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token;
                            return axios(originalRequest);
                        })
                        .catch((err) => {
                            console.error('Error while getting token using refresh token.', err);
                        });
                } else {
                    console.log('Refresh token is expired', tokenParts.exp, now);
                    store.dispatch({
                        type: USER_LOGOUT
                    });
                }
            } else {
                console.log('Refresh token not available.');
                store.dispatch({
                    type: USER_LOGOUT
                });
            }
        }

        // specific error handling done elsewhere
        return Promise.reject(error);
    }
);

export const postSignupApi = (singupRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.post(`${BACKEND_API_GATEWAY_URL}/api/account/signup`, singupRequestBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const postLoginApi = async (loginRequestBody) => {
    const axiosConfig = {
        headers: {
            'Authorization': 'Basic ' + btoa(APP_CLIENT_ID + ':' + APP_CLIENT_SECRET),
            'Content-Type': 'application/json'
        }
    };
    //const loginRequestBodyEncoded = qs.stringify(loginRequestBody);
    const responseData = await axios
        .post(`${BACKEND_API_GATEWAY_URL}/account/oauth/token`, loginRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const getUserInfoApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios.get(`${BACKEND_API_GATEWAY_URL}/appUsers/userInfo`, axiosConfig)
        .then((response) => {
        return response.data;
    });
    return responseData;
};

export const getUserApi = async (userId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios.get(`${BACKEND_API_GATEWAY_URL}/api/account/user?userId=${userId}`, axiosConfig)
        .then((response) => {
        return response.data;
    });
    return responseData;
};

export const putUserInfoApi = async (userInfoRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios
        .put(`${BACKEND_API_GATEWAY_URL}/api/account/userInfo`, userInfoRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const getAllRolesApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/account/roles`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllUsersApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/account/users`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const deleteUserApi = async (userId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.delete(`${BACKEND_API_GATEWAY_URL}/api/account/user/${userId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const updateUserApi = async (userId, userUpdateRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios
        .put(`${BACKEND_API_GATEWAY_URL}/api/account/user/${userId}`, userUpdateRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const getProductDetailApi = async (productId) => {
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/product/${productId}`).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getBookDetailApi = async (productId) => {
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/books/${productId}`).then((response) => {
        return response.data;
    });
    return responseData;
};


export const createProductApi = async (productReqBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios.post(`${BACKEND_API_GATEWAY_URL}/api/catalog/product`, productReqBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const updateProductDetailApi = async (productReqBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios.put(`${BACKEND_API_GATEWAY_URL}/api/catalog/product`, productReqBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const deleteProductApi = async (productId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = await axios.delete(`${BACKEND_API_GATEWAY_URL}/api/catalog/product/${productId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getProductReviewsApi = async (productId) => {
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/review?productId=${productId}`).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getProductCategories = async () => {
    const responseData = axios
        .get(`${BACKEND_API_GATEWAY_URL}/api/catalog/productCategories?direction=ASC&orderBy=PRODUCTCATEGORYNAME`)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const createProductReviewApi = async (createProductReviewRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios
        .post(`${BACKEND_API_GATEWAY_URL}/api/catalog/review`, createProductReviewRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const uploadImageApi = async (axiosConfig, formData) => {
    const accessToken = JSON.parse(localStorage.getItem('userInfo'))?.token;

    if (accessToken) {
        axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    const responseData = await axios.post(`${BACKEND_API_GATEWAY_URL}/api/catalog/image/upload`, formData, axiosConfig).then((response) => {
        console.log('Resp ::', response.data);
        return response.data;
    });
    return responseData;
};

export const getImageApi = async (imageId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${imageId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllProductsDetailApi = async (pageNumber) => {
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/products?page=${pageNumber}&size=8`).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllBooksDetailApi = async (pageNumber) => {
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/books`).then((response) => {
        return response.data;
    });
    console.log(responseData);
    return responseData;
};

export const addToCartApi = async (addToCartRequestBody) => {
    const axiosConfig = getAxiosConfig();
    console.log("here on to cart position");
    console.log(addToCartRequestBody);
    const responseData = axios
        .post(`${BACKEND_API_GATEWAY_URL}/positions/carts`, addToCartRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const addPositionApi = async (addPositionBody) => {
    const axiosConfig = getAxiosConfig();
    console.log("here on position");
    console.log(addPositionBody);
    const responseData = axios
        .post(`${BACKEND_API_GATEWAY_URL}/positions`, addPositionBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};


export const getCartDetailsApi = async (cartId) => {
    const axiosConfig = getAxiosConfig();
    const cartDetails = await axios.get(`${BACKEND_API_GATEWAY_URL}/carts/${cartId}`, axiosConfig).then((response) => {
        return response.data;
    });

    let sortedCart = {
        ...cartDetails,
        cartItems: cartDetails.orderPositions.sort((a, b) => {
            return a.id.localeCompare(b.id);
        })
    };
    console.log(sortedCart);
    return sortedCart;
};

export const removeCartItemApi = async (cartItemId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.delete(`${BACKEND_API_GATEWAY_URL}/api/order/cart/cartItem/${cartItemId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllOrdersApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/order/orders`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllMyOrdersApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/order/order/myorders`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};
export const previewOrderApi = async (previewOrderRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios
        .post(`${BACKEND_API_GATEWAY_URL}/api/order/previewOrder`, previewOrderRequestBody, axiosConfig)
        .then((response) => {
            return response.data;
        });
    return responseData;
};

export const placeOrderApi = async (placeOrderRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.post(`${BACKEND_API_GATEWAY_URL}/api/order/order`, placeOrderRequestBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getOrderApi = async (orderId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/order/order/${orderId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const saveAddressApi = async (addressRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.post(`${BACKEND_API_GATEWAY_URL}/api/billing/address`, addressRequestBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllAddressesApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/billing/address`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const deleteAddressApi = async (addressId) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.delete(`${BACKEND_API_GATEWAY_URL}/api/billing/address/${addressId}`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const savePaymentMethodApi = async (cardRequestBody) => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.post(`${BACKEND_API_GATEWAY_URL}/api/payment/paymentMethod`, cardRequestBody, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

export const getAllPaymentMethodsApi = async () => {
    const axiosConfig = getAxiosConfig();
    const responseData = axios.get(`${BACKEND_API_GATEWAY_URL}/api/payment/paymentMethod`, axiosConfig).then((response) => {
        return response.data;
    });
    return responseData;
};

const getAxiosConfig = () => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'

            //'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'

        }
    };

    const accessToken = JSON.parse(localStorage.getItem('userInfo'))?.token;

    if (accessToken) {
        axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return axiosConfig;
};

