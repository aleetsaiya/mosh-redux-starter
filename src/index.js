import store from "./customStore";
import * as actionsCreater from "./actionsCreater";

store.subscribe(() => console.log("Store changed!"));
store.dispatch(actionsCreater.bugAdded("Bug 1"));
store.dispatch(actionsCreater.bugAdded("Bug 2"));
console.log(store.getState());
