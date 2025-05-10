import axios from "axios";
import { Toast } from "primereact/toast";
import { Dispatch } from "redux";
import { ADD_GROUP_PRICING_FAIL, ADD_GROUP_PRICING_REQUEST, ADD_GROUP_PRICING_SUCCESS, DELETE_GROUP_PRICING_FAIL, DELETE_GROUP_PRICING_REQUEST, DELETE_GROUP_PRICING_SUCCESS, EDIT_GROUP_PRICING_FAIL, EDIT_GROUP_PRICING_REQUEST, EDIT_GROUP_PRICING_SUCCESS, FETCH_GROUP_PRICING_LIST_FAIL, FETCH_GROUP_PRICING_LIST_REQUEST, FETCH_GROUP_PRICING_LIST_SUCCESS } from "../constants/groupPricing";

const getAuthToken = () => {
  return localStorage.getItem("api_token") || ""; // Get the token or return an empty string if not found
};

// Fetch hawala List
export const _fetchGroupPricingList = (search:string='') => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_GROUP_PRICING_LIST_REQUEST });
  try {
    const token = getAuthToken();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/group-pricings?search=${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response)
    dispatch({
      type: FETCH_GROUP_PRICING_LIST_SUCCESS,
      payload: {
        data:response.data.data.group_pricings,
    },
    });
    console.log(response)
  } catch (error: any) {
    console.log(error)
    dispatch({
      type: FETCH_GROUP_PRICING_LIST_FAIL,
      payload: error.message,
    });

  }
};

// Add hawala
export const _addGroupPricing = (newData: any, toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: ADD_GROUP_PRICING_REQUEST });
  try {
        const formData = new FormData();

        // Append each property of the `body` object to the `FormData` instance
        formData.append("name", newData.name);
        formData.append("email", newData.email);
        formData.append("password", newData.password);
        formData.append("address", newData.address);
        formData.append("phone_number", newData.phone_number);
        formData.append("commission_type", newData.commission_type);
        formData.append("amount", newData.amount);
        formData.append("status", newData.status);
    const token = getAuthToken();
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/group-pricings`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    //console.log(response)
    //const newData = { ...newUserData, id: response.data.data.user.id };
    dispatch({
      type: ADD_GROUP_PRICING_SUCCESS,
      payload: response.data.data.group_pricing,
    });
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Group Pricing added successfully",
      life: 3000,
    });
  } catch (error: any) {
    dispatch({
        type: ADD_GROUP_PRICING_FAIL,
        payload: error.message,
    });

    let errorMessage = "Failed to Add Group Pricing"; // Default message

    // Check if it's a validation error (422 status)
    if (error.response?.status === 422 && error.response.data?.errors) {
        // Get all error messages and join them
        const errorMessages = Object.values(error.response.data.errors)
            .flat() // Flatten array of arrays
            .join(', '); // Join with commas

        errorMessage = errorMessages || "Validation failed";
    }
    // Check for other API error formats
    else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
    }

    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
    });

  }
};

// Edit hawala
export const _editGroupPricing = (groupPriceId: number, updatedData: any, toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: EDIT_GROUP_PRICING_REQUEST });
  try {

    const token = getAuthToken();
        const formData = new FormData();

        // Append each property of the `body` object to the `FormData` instance
        formData.append("name", updatedData.name);
        formData.append("email", updatedData.email);
        formData.append("password", updatedData.password);
        formData.append("address", updatedData.address);
        formData.append("phone_number", updatedData.phone_number);
        formData.append("commission_type", updatedData.commission_type);
        formData.append("amount", updatedData.amount);
        formData.append("status", updatedData.status);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/group-pricings/${groupPriceId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newData = { ...updatedData, id: groupPriceId };
    dispatch({
      type: EDIT_GROUP_PRICING_SUCCESS,
      payload: newData,
    });
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Group Pricing updated successfully",
      life: 3000,
    });
  } catch (error: any) {
    dispatch({
      type: EDIT_GROUP_PRICING_FAIL,
      payload: error.message,
    });
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Group Price Update Fail",
      life: 3000,
    });
  }
};

// Delete Hawala Branch
export const _deleteGroupPricing = (groupPriceId: number, toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
  dispatch({ type: DELETE_GROUP_PRICING_REQUEST });
  try {
    const token = getAuthToken();
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/group-pricings/${groupPriceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: DELETE_GROUP_PRICING_SUCCESS,
      payload: groupPriceId,
    });
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Group Price deleted successfully",
      life: 3000,
    });
  } catch (error: any) {
    dispatch({
      type: DELETE_GROUP_PRICING_FAIL,
      payload: error.message,
    });
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete Hawala",
      life: 3000,
    });
  }
};
