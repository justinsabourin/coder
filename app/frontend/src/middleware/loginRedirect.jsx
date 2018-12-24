import history from "../history.js";

export default ({ getState, dispatch }) => {
  return next => action => {
    // if (
    //   action &&
    //   (action.type === "SIGNUP_USER_FULFILLED" ||
    //     action.type === "LOGIN_USER_FULFILLED")
    // ) {
    //   history.push("/");
    // } else
    if (
      action &&
      (action.type === "LOG_OUT" ||
        (action.type.endsWith("ERROR") &&
          action.payload &&
          action.payload.status === 401))
    ) {
      history.push("/login");
    }
    next(action);
  };
};
