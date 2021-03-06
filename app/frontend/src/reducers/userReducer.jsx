const reducer = function(
  state = {
    username: null,
    auth: {
      isLoggedIn: false,
      isLoggingIn: true
    }
  },
  action
) {
  let newAuth;
  switch (action.type) {
    case "CHECK_USER":
    case "SIGNUP_USER":
    case "LOGIN_USER":
      return { ...state, auth: { ...state.auth, isLoggingIn: true } };
    case "CHECK_USER_ERROR":
    case "SIGNUP_USER_ERROR":
    case "LOGIN_USER_ERROR":
      newAuth = { ...state.auth, isLoggingIn: false };
      return { ...state, auth: newAuth };
    case "CHECK_USER_FULFILLED":
    case "SIGNUP_USER_FULFILLED":
    case "LOGIN_USER_FULFILLED":
      return {
        ...state,
        username: action.payload.username,
        auth: { ...state.auth, isLoggingIn: false, isLoggedIn: true }
      };
    case "LOG_OUT":
      return {
        username: null,
        auth: {
          isLoggedIn: false,
          isLoggingIn: false
        }
      };
  }
  return state;
};

export default reducer;
