import configureStore from "./store/configureStore";
import { bugAdded, bugResolved, getUnresolvedBugs } from "./store/bugs";
import { projectAdded } from "./store/projects";

const store = configureStore();

store.subscribe(() => console.log("Store changed!", store.getState()));
store.dispatch(projectAdded({ name: "Project 1" }));
store.dispatch(bugAdded({ description: "Bug-1" }));
store.dispatch(bugAdded({ description: "Bug-2" }));
store.dispatch(bugResolved({ id: 1 }));
console.log("state:", store.getState());

const unResolved = getUnresolvedBugs(store.getState());
console.log("unResolved:", unResolved);
