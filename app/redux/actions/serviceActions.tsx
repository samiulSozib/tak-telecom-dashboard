import { Dispatch } from "redux";
import axios from "axios";
import {
  FETCH_SERVICE_LIST_REQUEST,
  FETCH_SERVICE_LIST_SUCCESS,
  FETCH_SERVICE_LIST_FAIL,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_SUCCESS,
  DELETE_SERVICE_FAIL,
  ADD_SERVICE_REQUEST,
  ADD_SERVICE_SUCCESS,
  ADD_SERVICE_FAIL,
  EDIT_SERVICE_REQUEST,
  EDIT_SERVICE_SUCCESS,
  EDIT_SERVICE_FAIL,
} from "../constants/serviceConstants";
import { Toast } from "primereact/toast";
import { Service } from "@/types/interface";

const getAuthToken = () => {
    return localStorage.getItem("api_token") || ""; // Get the token or return an empty string if not found
  };

// Fetch Service List
export const _fetchServiceList = (search:string='') => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_SERVICE_LIST_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/services?search=${search}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch({
      type: FETCH_SERVICE_LIST_SUCCESS,
      payload: response.data.data.services,
    });
  } catch (error: any) {
    dispatch({
      type: FETCH_SERVICE_LIST_FAIL,
      payload: error.message,
    });
  }
};

// Add Service
export const _addService = (newServiceData: Service,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_SERVICE_REQUEST });
  try {
    const body={
        service_name:newServiceData.service_name,
        service_category_id:newServiceData.service_category?.id,
        company_id:newServiceData.company?.id
    }
    const token = getAuthToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newData={...newServiceData,id:response.data.data.service.id}
    dispatch({
      type: ADD_SERVICE_SUCCESS,
      payload: newData,
    });
    toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Service added",
        life: 3000,
      });
  } catch (error: any) {
    dispatch({
      type: ADD_SERVICE_FAIL,
      payload: error.message,
    });
    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add service",
        life: 3000,
      });
  }
};

// Edit Service
export const _editService = (serviceId: number, updatedServiceData: Service,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: EDIT_SERVICE_REQUEST });
  try {
    const body={
        service_name:updatedServiceData.service_name,
        service_category_id:updatedServiceData?.service_category?.id,
        company_id:updatedServiceData.company?.id
    }
    const token = getAuthToken();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/services/${serviceId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newData={...updatedServiceData,id:response.data.data.service.id}
    dispatch({
      type: EDIT_SERVICE_SUCCESS,
      payload: newData,
    });
    toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Service edited",
        life: 3000,
      });
  } catch (error: any) {
    dispatch({
      type: EDIT_SERVICE_FAIL,
      payload: error.message,
    });
    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to edit service",
        life: 3000,
      });
  }
};

// Delete Service
export const _deleteService = (serviceId: number,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: DELETE_SERVICE_REQUEST });
  try {
    const token = getAuthToken();
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch({
      type: DELETE_SERVICE_SUCCESS,
      payload: serviceId,
    });
    toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Service deleted",
        life: 3000,
      });
  } catch (error: any) {
    dispatch({
      type: DELETE_SERVICE_FAIL,
      payload: error.message,
    });
    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete service",
        life: 3000,
      });
  }
};
