import { browserHistory } from 'react-router';

export default ({getState, dispatch}) => {
  return (next) => (action) => {
    if (action && (action.type === 'SIGNUP_USER_FULFILLED' || action.type === 'LOGIN_USER_FULFILLED')) {
      browserHistory.push('/');
    } else if (action && action.type.endsWith('ERROR') && action.payload && action.payload.status === 401) {
      browserHistory.push('/login');
    }
    next(action);

  }
}