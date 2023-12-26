import {
    COUNTRY_LIST_FAIL,
    COUNTRY_LIST_REQUEST, COUNTRY_LIST_SUCCESS
} from "../constants/productConstants";
import {getCountries} from "../service/RestApiCalls";
import {getErrorMessage} from "../service/CommonUtils";

export const countriesAction = () => async (dispatch) => {
    try {
        console.log("1: ")
        dispatch({type: COUNTRY_LIST_REQUEST});
        //Get All Products Detail
        const countries = await getCountries();
        console.log("2: ", countries)
        dispatch({
            type: COUNTRY_LIST_SUCCESS,
            payload: countries,
        });
    } catch (error) {
        dispatch({
            type: COUNTRY_LIST_FAIL,
            payload: getErrorMessage(error)
        });
    }
};