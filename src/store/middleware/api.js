import axios from "axios";
import * as actions from "../api";

const api = (store) => (next) => async (action) => {
  if (action.type !== actions.apiRequest.type) {
    next(action);
    return;
  }
  const { url, method, data, onSuccess, onError } = action.payload;
  next(action);
  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });
    // General
    store.dispatch(actions.apiCallSuccess(response.data));
    // Sepecific
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // General
    store.dispatch(actions.apiCallFailed(error));
    // Specific
    if (onError) store.dispatch({ type: onError, payload: error });
  }
};

export default api;
