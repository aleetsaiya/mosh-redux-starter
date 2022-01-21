const func = (store) => (next) => (action) => {
  if (typeof action === "function") action(store.dispatch, store.getState);
  else return next(action);
};

export default func;
