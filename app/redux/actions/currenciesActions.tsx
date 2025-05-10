import { Dispatch } from "redux";
import axios from "axios";

import {
    FETCH_CURRENCIES_REQUEST,
    FETCH_CURRENCIES_SUCCESS,
    FETCH_CURRENCIES_FAILURE,
    ADD_CURRENCY_REQUEST,
    ADD_CURRENCY_SUCCESS,
    ADD_CURRENCY_FAIL,
    EDIT_CURRENCY_REQUEST,
    EDIT_CURRENCY_SUCCESS,
    EDIT_CURRENCY_FAIL,
    DELETE_CURRENCY_REQUEST,
    DELETE_CURRENCY_SUCCESS,
    DELETE_CURRENCY_FAIL,
} from "../constants/currenciesConstants";
import { Currency } from "@/types/interface";
import { Toast } from "primereact/toast";

const getAuthToken = () => {
    return localStorage.getItem("api_token") || ""; // Get the token or return an empty string if not found
};

// Fetch currencies
export const _fetchCurrencies = () => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CURRENCIES_REQUEST });

    try {
        const token = getAuthToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/currencies`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: FETCH_CURRENCIES_SUCCESS, payload: response.data.data.currencies });
    } catch (error: any) {
        dispatch({ type: FETCH_CURRENCIES_FAILURE, payload: error.message });
    }
};

// Add a currency
export const _addCurrency = (currencyData: Currency,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: ADD_CURRENCY_REQUEST });

    try {
        const token = getAuthToken();
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/currencies`,
            currencyData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        dispatch({ type: ADD_CURRENCY_SUCCESS, payload: response.data.data.currency });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Currency added",
            life: 3000,
          });
    } catch (error: any) {
        dispatch({ type: ADD_CURRENCY_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add currency",
            life: 3000,
          });
    }
};

// Edit a currency
export const _editCurrency = (currencyId: number, currencyData: Currency,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: EDIT_CURRENCY_REQUEST });

    try {
        const token = getAuthToken();
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/currencies/${currencyId}`,
            currencyData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        //console.log(response)
        dispatch({ type: EDIT_CURRENCY_SUCCESS, payload: response.data.data.currency });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Currency edited",
            life: 3000,
          });
    } catch (error: any) {
        //console.log(error)
        dispatch({ type: EDIT_CURRENCY_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to edit currency",
            life: 3000,
          });
    }
};

// Delete a currency
export const _deleteCurrency = (currencyId: number,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_CURRENCY_REQUEST });

    try {
        const token = getAuthToken();
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/currencies/${currencyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DELETE_CURRENCY_SUCCESS, payload: currencyId });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Currency deleted",
            life: 3000,
          });
    } catch (error: any) {
        dispatch({ type: DELETE_CURRENCY_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete currency",
            life: 3000,
          });
    }
};
