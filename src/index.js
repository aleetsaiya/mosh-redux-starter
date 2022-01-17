import configureStore from "./store/configureStore";
import * as actionsCreater from "./store/bugs";

const store = configureStore();

store.subscribe(() => console.log("Store changed!"));
store.dispatch(actionsCreater.bugAdded("Bug 1"));
store.dispatch(actionsCreater.bugAdded("Bug 2"));
store.dispatch(actionsCreater.bugAdded("Bug 3"));
store.dispatch(actionsCreater.bugResolved(1));
console.log(store.getState());
