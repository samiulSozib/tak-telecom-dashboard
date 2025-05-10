// store/actions/districtActions.ts
import axios from "axios";
import { Dispatch } from "redux";
import {
    FETCH_DISTRICTS_REQUEST,
    FETCH_DISTRICTS_SUCCESS,
    FETCH_DISTRICTS_FAIL,
    ADD_DISTRICT_REQUEST,
    ADD_DISTRICT_SUCCESS,
    ADD_DISTRICT_FAIL,
    EDIT_DISTRICT_REQUEST,
    EDIT_DISTRICT_SUCCESS,
    EDIT_DISTRICT_FAIL,
    DELETE_DISTRICT_REQUEST,
    DELETE_DISTRICT_SUCCESS,
    DELETE_DISTRICT_FAIL,
} from "../constants/districtsConstants";
import { District } from "@/types/interface";
import { Toast } from "primereact/toast";

const getAuthToken = () => {
    return localStorage.getItem("api_token") || "";
};

// Fetch Districts
export const _fetchDistricts = () => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_DISTRICTS_REQUEST });
    try {
        const token = getAuthToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/districts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: FETCH_DISTRICTS_SUCCESS, payload: response.data.data.districts });
    } catch (error: any) {
        dispatch({ type: FETCH_DISTRICTS_FAIL, payload: error.message });
    }
};

// Add District
export const _addDistrict = (district: District,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: ADD_DISTRICT_REQUEST });
    try {
        const token = getAuthToken();
        const body={...district,province_id:district.province?.id}
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/districts`,
            body,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const newData={...district,id:response.data.data.district.id}
        dispatch({ type: ADD_DISTRICT_SUCCESS, payload: newData });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "District added",
            life: 3000,
          });
    } catch (error: any) {
        dispatch({ type: ADD_DISTRICT_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add district",
            life: 3000,
          });
    }
};

// Edit District
export const _editDistrict = (id: number, updatedData: District,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: EDIT_DISTRICT_REQUEST });
    try {
        const token = getAuthToken();
        const body={...updatedData,province_id:updatedData.province?.id}
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/districts/${id}`,
            updatedData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const newData={...updatedData,id:response.data.data.district.id}
        dispatch({ type: EDIT_DISTRICT_SUCCESS, payload: newData });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "District edited",
            life: 3000,
          });
    } catch (error: any) {
        dispatch({ type: EDIT_DISTRICT_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to edit district",
            life: 3000,
          });
    }
};

// Delete District
export const _deleteDistrict = (id: number,toast: React.RefObject<Toast>) => async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_DISTRICT_REQUEST });
    try {
        const token = getAuthToken();
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/districts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: DELETE_DISTRICT_SUCCESS, payload: id });
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "District deleted",
            life: 3000,
          });
    } catch (error: any) {
        dispatch({ type: DELETE_DISTRICT_FAIL, payload: error.message });
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete district",
            life: 3000,
          });
    }
};
