import axios from "axios";
import {
  FETCH_RESELLER_GROUP_LIST_REQUEST,
  FETCH_RESELLER_GROUP_LIST_SUCCESS,
  FETCH_RESELLER_GROUP_LIST_FAIL,
  DELETE_RESELLER_GROUP_REQUEST,
  DELETE_RESELLER_GROUP_SUCCESS,
  DELETE_RESELLER_GROUP_FAIL,
  ADD_RESELLER_GROUP_REQUEST,
  ADD_RESELLER_GROUP_SUCCESS,
  ADD_RESELLER_GROUP_FAIL,
  EDIT_RESELLER_GROUP_REQUEST,
  EDIT_RESELLER_GROUP_SUCCESS,
  EDIT_RESELLER_GROUP_FAIL,
} from "../constants/resellerGroupConstants";
import { ResellerGroup } from "@/types/interface";
import { Toast } from "primereact/toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const getAuthToken = () => localStorage.getItem("api_token") || ""; // Fetch token from localStorage

// Fetch Reseller Groups
export const _fetchResellerGroups = () => async (dispatch: any) => {
  dispatch({ type: FETCH_RESELLER_GROUP_LIST_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/reseller-groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: FETCH_RESELLER_GROUP_LIST_SUCCESS,
      payload: response.data.data.reseller_groups,
    });
  } catch (error: any) {
    dispatch({
      type: FETCH_RESELLER_GROUP_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add Reseller Group
export const _addResellerGroup =
  (groupData: ResellerGroup, toast: React.RefObject<Toast>) => async (dispatch: any) => {
    dispatch({ type: ADD_RESELLER_GROUP_REQUEST });
    try {
      const token = getAuthToken();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/reseller-groups`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response)
      dispatch({
        type: ADD_RESELLER_GROUP_SUCCESS,
        payload: response.data.data.reseller_group,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Reseller Group added successfully",
        life: 3000,
      });
    } catch (error: any) {
      dispatch({
        type: ADD_RESELLER_GROUP_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      //console.log(error)
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add Reseller Group",
        life: 3000,
      });
    }
  };

// Edit Reseller Group
export const _editResellerGroup =
  (id: number, groupData: ResellerGroup, toast: React.RefObject<Toast>) => async (dispatch: any) => {
    dispatch({ type: EDIT_RESELLER_GROUP_REQUEST });
    //console.log(id)
    //console.log(groupData)
    try {
      const token = getAuthToken();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/reseller-groups/${id}`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({
        type: EDIT_RESELLER_GROUP_SUCCESS,
        payload: response.data.data.reseller_group,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Reseller Group updated successfully",
        life: 3000,
      });
    } catch (error: any) {
      dispatch({
        type: EDIT_RESELLER_GROUP_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      //console.log(error)

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update Reseller Group",
        life: 3000,
      });
    }
  };

// Delete Reseller Group
export const _deleteResellerGroup =
  (id: number, toast: React.RefObject<Toast>) => async (dispatch: any) => {
    dispatch({ type: DELETE_RESELLER_GROUP_REQUEST });
    try {
      const token = getAuthToken();
      const response=await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/reseller-groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response)
      dispatch({
        type: DELETE_RESELLER_GROUP_SUCCESS,
        payload: id,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Reseller Group deleted successfully",
        life: 3000,
      });
    } catch (error: any) {
      dispatch({
        type: DELETE_RESELLER_GROUP_FAIL,
        payload: error.message,
      });
      //console.log(error)
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Reseller Group",
        life: 3000,
      });
    }
  };
