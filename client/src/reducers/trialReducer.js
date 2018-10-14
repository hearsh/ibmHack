import {
  ADD_TRIAL,
  GET_TRIALS,
  GET_TRIAL,
  DELETE_TRIAL,
  TRIAL_LOADING,
  ADD_ONE_MORE
} from "../actions/types";

const initialState = {
  trial: {},
  trials: [],
  secrettrial: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TRIAL_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TRIALS:
      return {
        ...state,
        trials: action.payload,
        loading: false
      };
    case GET_TRIAL:
      return {
        ...state,
        trial: action.payload,
        loading: false
      };
    case ADD_TRIAL:
      return {
        ...state,
        trials: [action.payload, ...state.trials]
      };
    case DELETE_TRIAL:
      return {
        ...state,
        trials: state.trials.filter(trial => trial._id !== action.payload)
      };
    case ADD_ONE_MORE:
      return {
        ...state,
        trials: [],
        secrettrial: action.payload
      };

    default:
      return state;
  }
}
