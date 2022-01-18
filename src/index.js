import configureStore from "./store/configureStore";
import * as actionsCreator from "./store/bugs";
import { projectAdded } from "./store/projects";

const store = configureStore();

store.subscribe(() => console.log("Store changed!", store.getState()));
store.dispatch(projectAdded({ name: "Project 1" }));
store.dispatch(actionsCreator.bugAdded({ description: "Bug-1" }));
store.dispatch(actionsCreator.bugAdded({ description: "Bug-2" }));
store.dispatch(actionsCreator.bugResolved({ id: 1 }));
console.log(store.getState());

const unResolved = store
  .getState()
  .entities.bugs.filter((bug) => bug.resolved === false);
console.log("unResolved:", unResolved);
