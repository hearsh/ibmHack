import axios from "axios";

import {
  ADD_TRIAL,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_TRIALS,
  GET_TRIAL,
  TRIAL_LOADING,
  DELETE_TRIAL
} from "./types";

// Add Trial
export const addTrial = trialData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/trials", trialData)
    .then(res =>
      dispatch({
        type: ADD_TRIAL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Trials
export const getTrials = () => dispatch => {
  dispatch(setTrialLoading());
  axios
    .get("/api/trials/filter")
    .then(res =>
      dispatch({
        type: GET_TRIALS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TRIALS,
        payload: null
      })
    );
};

// Get Registered Trials
export const getRegisteredTrials = () => dispatch => {
  dispatch(setTrialLoading());
  axios
    .get("/api/trials/registered")
    .then(res =>
      dispatch({
        type: GET_TRIALS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TRIALS,
        payload: null
      })
    );
};

// Get Trial
export const getTrial = id => dispatch => {
  dispatch(setTrialLoading());
  axios
    .get(`/api/trials/${id}`)
    .then(res =>
      dispatch({
        type: GET_TRIAL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TRIAL,
        payload: null
      })
    );
};

// Delete Trial
export const deleteTrial = id => dispatch => {
  axios
    .delete(`/api/trials/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_TRIAL,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Interested
export const addInterested = id => dispatch => {
  axios
    .post(`/api/trials/interested/${id}`)
    .then(res => dispatch(getTrials()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Interested
export const removeInterested = id => dispatch => {
  axios
    .post(`/api/trials/uninterested/${id}`)
    .then(res => dispatch(getTrials()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setTrialLoading = () => {
  return {
    type: TRIAL_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
