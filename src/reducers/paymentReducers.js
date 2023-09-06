import {
  PAYMENT_METHOD_ADD_REQUEST,
  PAYMENT_METHOD_ADD_SUCCESS,
  PAYMENT_METHOD_ADD_FAIL,
  PAYMENT_METHOD_ADD_RESET,
  PAYMENT_METHOD_LIST_MY_REQUEST,
  PAYMENT_METHOD_LIST_MY_SUCCESS,
  PAYMENT_METHOD_LIST_MY_FAIL,
  PAYMENT_METHOD_LIST_MY_RESET
} from '../constants/paymentConstants';

export const paymentMethodSaveReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_METHOD_ADD_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PAYMENT_METHOD_ADD_SUCCESS:
      return {
        loading: false,
        success: true
      };
    case PAYMENT_METHOD_ADD_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case PAYMENT_METHOD_ADD_RESET:
      return {};
    default:
      return state;
  }
};

// a = { t: 1, b: 2 }, newObj = { ...a, t: 42 }
export const paymentMethodListMyReducer = (state = { paymentMethods: [], loading: false }, action) => {
  switch (action.type) {
    case PAYMENT_METHOD_LIST_MY_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PAYMENT_METHOD_LIST_MY_SUCCESS:
      return {
        loading: false,
        paymentMethods: action.payload
      };
    case PAYMENT_METHOD_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case PAYMENT_METHOD_LIST_MY_RESET:
      // console.log('ttetet')
      return { paymentMethods: [] };
    default:
      // console.log('defMid')
      return state;
  }
};
