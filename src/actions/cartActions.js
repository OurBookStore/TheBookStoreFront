import {
  CART_ADD_ITEM_FAIL,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_DETAILS_FAIL,
  CART_DETAILS_REQUEST,
  CART_DETAILS_SUCCESS,
  CART_REMOVE_ITEM_FAIL,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  POSITION_ADD_ITEM_FAIL,
  POSITION_ADD_ITEM_REQUEST,
  POSITION_ADD_ITEM_SUCCESS,
  POSITION_UPDATE_ITEM_FAIL,
  POSITION_UPDATE_ITEM_REQUEST,
  POSITION_UPDATE_ITEM_SUCCESS
} from '../constants/cartConstants';
import { getErrorMessage } from '../service/CommonUtils';
import {
  addPositionApi,
  addToCartApi,
  getCartDetailsApi,
  getCartDetailsApiByUserId,
  removeCartItemApi,
  updatePositionApi
} from '../service/RestApiCalls';

export const addToCartAction = (addToCartRequestBody) => async (dispatch) => {
  try {
    dispatch({
      type: CART_ADD_ITEM_REQUEST
    });
    //Add to cart Api
    await addToCartApi(addToCartRequestBody);

    dispatch({
      type: CART_ADD_ITEM_SUCCESS
    });

    //Get Cart Details
    dispatch(getCartDetailsAction(addToCartRequestBody.cartId));
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const addPositionAction = (addPositionRequestBody) => async (dispatch) => {
  try {
    dispatch({
      type: POSITION_ADD_ITEM_REQUEST
    });
    //Add to cart Api
    let response = await addPositionApi(addPositionRequestBody);
    dispatch({
      type: POSITION_ADD_ITEM_SUCCESS
    });
    return response;
  } catch (error) {
    dispatch({
      type: POSITION_ADD_ITEM_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const updatePositionAction = (updatePositionRequestBody) => async (dispatch) => {
  try {
    dispatch({
      type: POSITION_UPDATE_ITEM_REQUEST
    });
    //Add to cart Api
    let response = await updatePositionApi(updatePositionRequestBody);
    dispatch({
      type: POSITION_UPDATE_ITEM_SUCCESS
    });
    return response;
  } catch (error) {
    dispatch({
      type: POSITION_UPDATE_ITEM_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const getCartDetailsAction = (cartId) => async (dispatch) => {
  try {
    dispatch({
      type: CART_DETAILS_REQUEST
    });
    //Get cart details Api
    console.log('Get cartDetail req with id', cartId);
    const cartResponse = await getCartDetailsApi(cartId);
    dispatch({
      type: CART_DETAILS_SUCCESS,
      payload: cartResponse
    });
  } catch (error) {
    dispatch({
      type: CART_DETAILS_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const getCartDetailsActionByUserId = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: CART_DETAILS_REQUEST
    });
    //Get cart details Api
    console.log('Get cartDetail req with user id', userId);
    const cartResponse = await getCartDetailsApiByUserId(userId);
    dispatch({
      type: CART_DETAILS_SUCCESS,
      payload: cartResponse
    });
  } catch (error) {
    dispatch({
      type: CART_DETAILS_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const removeFromCartAction = (positionId, userId) => async (dispatch) => {
  try {
    dispatch({
      type: CART_REMOVE_ITEM_REQUEST
    });
    //Add to cart Api
    await removeCartItemApi(positionId);

    dispatch({
      type: CART_REMOVE_ITEM_SUCCESS
    });

    //Get Cart Details
    dispatch(getCartDetailsApiByUserId(userId));
  } catch (error) {
    dispatch({
      type: CART_REMOVE_ITEM_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
