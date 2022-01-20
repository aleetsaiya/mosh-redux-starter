import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    // actions => action handlers
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugAssignedToUser: (bugs, action) => {
      // use object destructuring to get id property then push into new variable "bugId"
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      // when received, record the lastFetch time
      bugs.lastFetch = Date.now();
    },
    bugsRequest: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
  },
});

// Action Creators
const url = "/bugs";

// origin Actioncreator, we can only return a pure javascript object,
// but use "thunk middleware", we can return a function
// with two arguments, "dispatch" and "getState".
// Like this: () => fn(dispatch, getState)
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  // use package "moment" to get diff minutes between lastFetch and current time
  const diffMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffMinutes < 10) return;

  dispatch(
    apiCallBegan({
      url: url,
      // 如果 request 開始 / 成功 / 失敗 時，要送出的 dispatch type
      onStart: slice.actions.bugsRequest.type,
      onSuccess: slice.actions.bugsReceived.type,
      onError: slice.actions.bugsRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

const {
  bugAdded,
  bugResolved,
  bugRemoved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequest,
  bugsRequestFailed,
} = slice.actions;

export default slice.reducer;
