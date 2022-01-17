import reducer from "./reducer";

function createStore(reducer) {
  console.log("Store created!");
  // create private variable
  let state;
  // maybe multiple UI will listener to the store
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  // use closure to change the private variable(state)
  function dispatch(action) {
    // call the reducer to get the new State
    state = reducer(state, action);

    // cause state have been changed, call every listerner
    for (let listener of listeners) {
      listener();
    }
  }

  // use closure to change the private variable(state)
  function getState() {
    return state;
  }

  // other files can only access variable in this interface
  return {
    subscribe,
    dispatch,
    getState,
  };
}

// export a instance of createStore
export default createStore(reducer);
