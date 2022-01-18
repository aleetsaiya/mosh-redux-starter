// next: next is the reference to the "next middleware function",
// if this's the only middleware function we have, next is going
// to be the reducer that is going to handle this action
const logger = (param) => (store) => (next) => (action) => {
  console.log("param", param);
  console.log("store", store);
  console.log("next", next);
  console.log("action", action);
};

export default logger;
