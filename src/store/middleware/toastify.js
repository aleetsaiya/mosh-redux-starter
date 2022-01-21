const toastify = (store) => (next) => (action) => {
  if (action.type === "error") console.log("Toastify:", action.payload.message);
  else {
    return next(action); // will reveive a promise from apiMiddleware
  }
};

export default toastify;
