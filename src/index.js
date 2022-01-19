import configureStore from "./store/configureStore";
import * as actions from "./store/api";

const store = configureStore();
store.dispatch(
  actions.apiRequest({
    url: "/bugs",
  })
);
