import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import toastify from "./middleware/toastify";
import api from "./middleware/api";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer, middleware: [toastify, api] });
}
