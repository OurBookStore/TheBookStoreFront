import {
    CART_ADD_ITEM_FAIL,
    CART_ADD_ITEM_REQUEST,
    CART_ADD_ITEM_RESET,
    CART_ADD_ITEM_SUCCESS,
    CART_CLEAR_ITEMS,
    CART_DETAILS_FAIL,
    CART_DETAILS_REQUEST,
    CART_DETAILS_RESET,
    CART_DETAILS_SUCCESS,
    CART_REMOVE_ITEM_FAIL,
    CART_REMOVE_ITEM_REQUEST,
    CART_REMOVE_ITEM_RESET,
    CART_REMOVE_ITEM_SUCCESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
    POSITION_UPDATE_ITEM_FAIL,
    POSITION_UPDATE_ITEM_REQUEST,
    POSITION_UPDATE_ITEM_RESET,
    POSITION_UPDATE_ITEM_SUCCESS
} from '../constants/cartConstants';

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ADD_ITEM_REQUEST:
            console.log("In cart Add item");
            return {
                loading: false,
                cart: action.payload
            };
            const item = action.payload;
            console.log("Check Item ", item);
            const existItem = state.cartItems.find((x) => x.product === item.product);

            console.log("Get existsItem ", existItem);
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) => (x.product === existItem.product ? item : x))
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                };
            }
        case CART_DETAILS_REQUEST: {
            return {
                loading: false,
                cart: action.payload
            };
        }
        case CART_REMOVE_ITEM_SUCCESS:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload)
            };
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            };
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            };
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};

export const cartDetailReducer = (state = {cart: {}}, action) => {
    switch (action.type) {
        case CART_DETAILS_REQUEST:{
            return {...state, loading: true};
        }
        case CART_DETAILS_SUCCESS:
            return {loading: false, cart: action.payload};
        case CART_DETAILS_FAIL:
            return {loading: false, error: action.payload};
        case CART_DETAILS_RESET:
            return {};
        default:
            return state;
    }
};

export const cartAddReducer = (state = {}, action) => {
    switch (action.type) {
        case CART_ADD_ITEM_REQUEST:
            return {loading: true};
        case CART_ADD_ITEM_SUCCESS:
            return {loading: false, success: true};
        case CART_ADD_ITEM_FAIL:
            return {loading: false, error: action.payload};
        case CART_ADD_ITEM_RESET:
            return {};
        default:
            return state;
    }
};

export const cartUpdateItemReducer = (state = {}, action) => {
    switch (action.type) {
        case POSITION_UPDATE_ITEM_REQUEST:
            return {loading: true};
        case POSITION_UPDATE_ITEM_SUCCESS:
            return {loading: false, success: true};
        case POSITION_UPDATE_ITEM_FAIL:
            return {loading: false, error: action.payload};
        case POSITION_UPDATE_ITEM_RESET:
            return {};
        default:
            return state;
    }
};

export const cartRemoveReducer = (state = {}, action) => {
    switch (action.type) {
        case CART_REMOVE_ITEM_REQUEST:
            console.log("(Rem)Reqest Reducer",action.payload);
            console.log(" (Rem)Reqest Reducer",state);
            return {loading: true};
        case CART_REMOVE_ITEM_SUCCESS:
            console.log("(Rem)Cuccess Reducer",action.payload);
            console.log("(Rem)Cuccess Reducer",state);
            return {loading: false, success: true};
        case CART_REMOVE_ITEM_FAIL:
            return {loading: false, error: action.payload};
        case CART_REMOVE_ITEM_RESET:
            return {};
        default:
            return state;
    }
};
