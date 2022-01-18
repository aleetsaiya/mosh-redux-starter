import { combineReducers } from "redux";
import projectsReducer from "./projects";
import bugsReducer from "./bugs";
import usersReducer from "./users";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
  users: usersReducer,
});
