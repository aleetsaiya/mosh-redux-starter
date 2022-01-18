import { combineReducers } from "redux";
import projectsReducer from "./projects";
import bugsReducer from "./bugs";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
});
