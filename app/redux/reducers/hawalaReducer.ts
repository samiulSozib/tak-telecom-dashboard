import { FETCH_HAWALA_LIST_REQUEST, FETCH_HAWALA_LIST_SUCCESS, FETCH_HAWALA_LIST_FAIL, ADD_HAWALA_REQUEST, ADD_HAWALA_SUCCESS, ADD_HAWALA_FAIL, EDIT_HAWALA_REQUEST, EDIT_HAWALA_SUCCESS, EDIT_HAWALA_FAIL, DELETE_HAWALA_REQUEST, DELETE_HAWALA_SUCCESS, DELETE_HAWALA_FAIL } from '../constants/hawalaConstants';

  import { Hawala, HawalaBranch, Pagination } from "@/types/interface";

  interface HawalaState {
    loading: boolean;
    hawalas: Hawala[];
    error: string | null;
    pagination: Pagination | null;

  }

  const initialState: HawalaState = {
    loading: false,
    hawalas: [],
    error: null,
    pagination: null,
  };

  export const hawalaReducer = (state = initialState, action: any): HawalaState => {
    switch (action.type) {
      case FETCH_HAWALA_LIST_REQUEST:
      case DELETE_HAWALA_REQUEST:
      case ADD_HAWALA_REQUEST:
      case EDIT_HAWALA_REQUEST:
        return { ...state, loading: true, error: null };

      case FETCH_HAWALA_LIST_SUCCESS:
        return { ...state, loading: false,
            hawalas: action.payload.data,
            pagination: action.payload.pagination,
 };

      case ADD_HAWALA_SUCCESS:
        return { ...state, loading: false, hawalas: [...state.hawalas, action.payload] };

      case EDIT_HAWALA_SUCCESS:
        return {
          ...state,
          loading: false,
          hawalas: state.hawalas.map((branch) =>
            branch.id === action.payload.id ? action.payload : branch
          ),
        };

      case DELETE_HAWALA_SUCCESS:
        return {
          ...state,
          loading: false,
          hawalas: state.hawalas.filter((branch) => branch.id !== action.payload),
        };

      case FETCH_HAWALA_LIST_FAIL:
      case DELETE_HAWALA_FAIL:
      case ADD_HAWALA_FAIL:
      case EDIT_HAWALA_FAIL:
        return { ...state, loading: false, error: action.payload };

      default:
        return state;
    }
  };
