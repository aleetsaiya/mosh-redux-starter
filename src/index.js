import configureStore from "./store/configureStore";
import {
  bugAdded,
  bugResolved,
  bugAssignedToUser,
  getUnresolvedBugs,
  getBugsByUser,
} from "./store/bugs";
import { projectAdded } from "./store/projects";
import { userAdded } from "./store/users";

const store = configureStore();

store.subscribe(() => console.log("Store changed!", store.getState()));
store.dispatch(userAdded({ name: "Alee" }));
store.dispatch(projectAdded({ name: "Project 1" }));
store.dispatch(bugAdded({ description: "Bug-1" }));
store.dispatch(bugAdded({ description: "Bug-2" }));
store.dispatch(bugAssignedToUser({ userId: 1, bugId: 2 }));
store.dispatch(bugResolved({ id: 1 }));

console.log("state:", store.getState());

const unResolved = getUnresolvedBugs(store.getState());
console.log("unResolved:", unResolved);

const bugs = getBugsByUser(2)(store.getState());
console.log("Bugs asign to user", bugs);
