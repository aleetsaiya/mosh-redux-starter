import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer, middleware: [logger("my params")] });
}
