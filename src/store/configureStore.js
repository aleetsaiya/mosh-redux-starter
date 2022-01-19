import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import func from "./middleware/func";
import toastify from "./middleware/toastify";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer, middleware: [toastify] });
}
