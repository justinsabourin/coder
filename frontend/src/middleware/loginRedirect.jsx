import { browserHistory } from 'react-router';

export default ({getState, dispatch}) => {
  return (next) => (action) => {
    if (action && (action.type === 'SIGNUP_USER_FULFILLED' || action.type === 'LOGIN_USER_FULFILLED')) {
      browserHistory.push('/');
    } else if (action && (action.type === 'CHECK_USER_ERROR')) {
      browserHistory.push('/login');
    }
    next(action);

  }
}