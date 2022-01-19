import { createAction } from "@reduxjs/toolkit";

export const apiRequest = createAction("apiRequest");
export const apiCallSuccess = createAction("apiCallSuccess");
export const apiCallFailed = createAction("apiCallFailed");
