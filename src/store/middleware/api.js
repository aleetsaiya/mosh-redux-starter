import axios from "axios";
import * as actions from "../api";

const api = (store) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) {
    next(action);
    return;
  }
  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  if (onStart) store.dispatch({ type: onStart });

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
    store.dispatch(actions.apiCallFailed(error.message));
    // Specific
    if (onError) store.dispatch({ type: onError, payload: error.message });
  }
};

export default api;
