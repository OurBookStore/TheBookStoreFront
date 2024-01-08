import {
  ORDER_PREVIEW_REQUEST,
  ORDER_PREVIEW_SUCCESS,
  ORDER_PREVIEW_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_REQUEST,
  ORDER_STATUS_REQUEST,
  ORDER_STATUS_SUCCESS,
  ORDER_STATUS_FAIL,
  ORDER_LIST_ALL_REQUEST,
  ORDER_LIST_ALL_SUCCESS, ORDER_LIST_ALL_FAIL
} from '../constants/orderConstants';
import { getErrorMessage } from '../service/CommonUtils';
import {
  getAllMyOrdersApi,
  previewOrderApi,
  placeOrderApi,
  getOrderApi,
  getAllOrdersApi,
  fillOrderByCartPositionsApi, getOrderById, addOrderStatus, getAllOrders
} from '../service/RestApiCalls';

export const saveBillingAddressIdToLocalStorage = (billingAddressId) => (dispatch) => {
  dispatch({
    type: 'ORDER_SAVE_BILLING_ADDRESS',
    payload: billingAddressId
  });
  localStorage.setItem('billingAddressId', billingAddressId);
};

export const saveShippingAddressIdToLocalStorage = (shippingAddressId) => (dispatch) => {
  dispatch({
    type: 'ORDER_SAVE_SHIPPING_ADDRESS',
    payload: shippingAddressId
  });
  localStorage.setItem('shippingAddressId', shippingAddressId);
};

export const savePaymentMethodIdToLocalStorage = (paymentMethodId) => (dispatch) => {
  dispatch({
    type: 'ORDER_SAVE_PAYMENT_METHOD',
    payload: paymentMethodId
  });
  localStorage.setItem('paymentMethodId', paymentMethodId);
};

export const listOrdersAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST
    });

    //Get All my Orders
    const ordersData = await getAllOrdersApi();

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: ordersData
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const listMyOrdersAction = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST
    });

    //Get All my Orders
    const myOrdersData = await getAllMyOrdersApi(userId);

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: myOrdersData
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const previewOrderAction = (previewOrderRequestBody) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_PREVIEW_REQUEST
    });

    //Preview Order
    const previewOrderData = await previewOrderApi(previewOrderRequestBody);

    dispatch({
      type: ORDER_PREVIEW_SUCCESS,
      payload: previewOrderData
    });
  } catch (error) {
    dispatch({

      type: ORDER_PREVIEW_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const placeOrderAction = (placeOrderRequestBody,cartId) => (dispatch) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST
    });

    //Create Order
    debugger;
    placeOrderApi(placeOrderRequestBody).then(
        (orderId) => {
          return fillOrderByCartPositionsApi(orderId,cartId).then(
            (orderId) => {
              const order =  getOrderById(orderId).then
              (order=> {
                  dispatch({
                    type: ORDER_CREATE_SUCCESS,
                    payload: order
                  });
                }
              )
            }
          )
        }
      )
    // debugger;
    // // const order = await getOrderById(orderId);
    // dispatch({
    //   type: ORDER_CREATE_SUCCESS,
    //   payload: order
    // });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const getOrderDetailsAction = (orderId) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST
    });

    //Get Order by Id
    const getOrderData = await getOrderById(orderId);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: getOrderData
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: getErrorMessage(error)
    });
  }
};

export const  addOrderStatusAction = (statusBody,orderId) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_STATUS_REQUEST
    });

    //Get Order by Id
    const addOrderData = await addOrderStatus(statusBody,orderId);

    dispatch({
      type: ORDER_STATUS_SUCCESS,
      payload: addOrderData
    });
  } catch (error) {
    dispatch({
      type: ORDER_STATUS_FAIL,
      payload: getErrorMessage(error)
    });
  }
};