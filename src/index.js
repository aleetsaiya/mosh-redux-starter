import store from "./store";
import { bugAdded, bugRemoved, bugResolved } from "./actionsCreater";

// subscribe the store that when state changed, it will call
const unsubscribe = store.subscribe(() => {
  console.log("Store changed", store.getState());
});

// dispatch to store
store.dispatch(bugAdded("Bug 1"));
store.dispatch(bugAdded("Bug 2"));

store.dispatch(bugResolved(1));

// unsubscribe state change
unsubscribe();

store.dispatch(bugRemoved(1));

console.log(store.getState());
