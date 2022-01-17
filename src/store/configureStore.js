import { configureStore } from "@reduxjs/toolkit";
import reducer from "./projects";

export default function () {
  // when use configureStore, we don't need to check redux devTool extension
  return configureStore({ reducer });
}
