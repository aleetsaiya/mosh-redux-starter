import configureStore from "./store/configureStore";
// import * as actionsCreator from "./store/bugs";
import { projectAdded } from "./store/projects";

const store = configureStore();

store.subscribe(() => console.log("Store changed!", store.getState()));
store.dispatch(projectAdded({ name: "Project 1" }));
console.log(store.getState());
