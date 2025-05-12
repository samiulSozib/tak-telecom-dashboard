// store/actions/orderActions.ts
import { Dispatch } from 'redux';
import axios from 'axios';

import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAIL,
  ADD_ORDER_REQUEST,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  EDIT_ORDER_REQUEST,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
} from '../constants/orderConstants';
import { Toast } from 'primereact/toast';

const getAuthToken = () => {
  return localStorage.getItem('api_token') || ''; // Retrieve the token from localStorage
};

// Fetch orders
export const _fetchOrders = (page: number = 1,search:string='',filters:any={}) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST });

  try {
    const token = getAuthToken();
    console.log(filters)
    const queryParams = new URLSearchParams();

    queryParams.append('page', String(page));
    queryParams.append('search', search);

    Object.entries(filters).forEach(([key, value]) => {
  if (value !== null && value !== undefined && value !== '') {
    queryParams.append(key, String(value));
  }
});


    const queryString = queryParams.toString();

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/orders?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: {
        data: response.data.data.orders,
        pagination: response.data.payload.pagination,
      } });
  } catch (error: any) {
    dispatch({ type: FETCH_ORDERS_FAIL, payload: error.message });
  }
};

// Add an order
export const _addOrder = (orderData: any) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_ORDER_REQUEST });

  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: ADD_ORDER_SUCCESS, payload: response.data.data });
  } catch (error: any) {
    dispatch({ type: ADD_ORDER_FAIL, payload: error.message });
  }
};

// Edit an order
export const _editOrder = (orderId: number, orderData: any) => async (dispatch: Dispatch) => {
  dispatch({ type: EDIT_ORDER_REQUEST });

  try {
    const token = getAuthToken();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: EDIT_ORDER_SUCCESS, payload: response.data.data });
  } catch (error: any) {
    dispatch({ type: EDIT_ORDER_FAIL, payload: error.message });
  }
};

// Delete an order
export const _deleteOrder = (orderId: number,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });

  try {
    const token = getAuthToken();
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
    toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Order deleted",
        life: 3000,
      });
  } catch (error: any) {
    dispatch({ type: DELETE_ORDER_FAIL, payload: error.message });
    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete order",
        life: 3000,
      });
  }
};
