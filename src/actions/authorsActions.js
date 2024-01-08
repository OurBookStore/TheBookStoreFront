import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_REVIEWS_REQUEST,
    PRODUCT_REVIEWS_SUCCESS,
    PRODUCT_REVIEWS_FAIL,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL,
    PRODUCT_IMAGE_REQUEST,
    PRODUCT_IMAGE_SUCCESS,
    PRODUCT_IMAGE_FAIL,
    AUTHOR_ADMIN_LIST_REQUEST,
    AUTHOR_ADMIN_LIST_SUCCESS,
    AUTHOR_ADMIN_LIST_FAIL
} from '../constants/productConstants';
import {getErrorMessage} from '../service/CommonUtils';
import {
    getAllProductsDetailApi,
    getProductDetailApi,
    getProductReviewsApi,
    createProductReviewApi,
    updateBookApi,
    createBookApi,
    getImageApi,
    getBookApi,
    getAllBooksPageDetailApi,
    deleteBookApi,
    deleteAuthorApi,
    updateAuthorApi,
    createAuthorApi,
    getAuthorApi, getAllAuthorsApi
} from '../service/RestApiCalls';
import {logout} from "./userActions";
import {listProductDetailsAction} from "./productActions";

export const getAllAuthorAction = (pageNumber) => async (dispatch) => {
    try {
        dispatch({type: AUTHOR_ADMIN_LIST_REQUEST});
        //Get All Author Detail
        const allProductsDetail = await getAllAuthorsApi();
        dispatch({
            type: AUTHOR_ADMIN_LIST_SUCCESS,
            payload: allProductsDetail,
            pageResponse: allProductsDetail
        });
    } catch (error) {
        dispatch({
            type: AUTHOR_ADMIN_LIST_FAIL,
            payload: getErrorMessage(error)
        });
    }
};

export const getAuthorAction = (id) => async (dispatch) => {
    try {
        dispatch({type: PRODUCT_DETAILS_REQUEST});

        const response = await getAuthorApi(id);
        console.log(response)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: response
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: getErrorMessage(error)
        });
    }
};

export const createAuthorAction = (request) => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST
        });

        const id = await createAuthorApi(request);

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: id
        });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: message
        });
    }
};

export const updateAuthorAction = (request) => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
        });

        //Update Product
        await updateAuthorApi(request);

        dispatch({
            type: PRODUCT_UPDATE_SUCCESS
        });
        // dispatch(listProductDetailsAction(request.productId));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: message
        });
    }
};

export const deleteAuthorAction = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
        });

        console.log("deleting author ", id)
        await deleteAuthorApi(id);

        dispatch({
            type: PRODUCT_DELETE_SUCCESS
        });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: message
        });
    }
};
