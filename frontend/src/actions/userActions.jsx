import axios from "axios";


export const signupUserStart = () => {
    return {type: 'SIGNUP_USER'};
};

export const signupUserFulfilled = (payload) => {
    return {type: 'SIGNUP_USER_FULFILLED', payload };
};

export const signupUserError = (payload) => {
    return {type: 'SIGNUP_USER_ERROR'};
};

export const signupUser = (userInfo) => (dispatch) => {
    dispatch(signupUserStart());

    return axios.post('/api/auth/signup', userInfo)
    .then(response => dispatch(signupUserFulfilled(response.data)))
    .catch(error => dispatch(signupUserError(error.data)));
};

export const loginUserStart = () => {
    return {type: 'LOGIN_USER'};
};

export const loginUserFulfilled = (payload) => {
    return {type: 'LOGIN_USER_FULFILLED', payload };
};

export const loginUserError = (payload) => {
    return {type: 'LOGIN_USER_ERROR'};
};

export const loginUser = (userInfo) => (dispatch) => {
    dispatch(loginUserStart());

    return axios.post('/api/auth', userInfo)
    .then(response => dispatch(loginUserFulfilled(response.data)))
    .catch(error => dispatch(loginUserError(error.data)));
};

export const checkUserStart = () => {
    return {type: 'CHECK_USER'};
};

export const checkUserFulfilled = (payload) => {
    return {type: 'CHECK_USER_FULFILLED', payload };
};

export const checkUserError = () => {
    return {type: 'CHECK_USER_ERROR'};
};

export const checkUser = () => (dispatch) => {
    dispatch(checkUserStart());

    return axios.get('/api/auth/self')
    .then(response => {
        return dispatch(checkUserFulfilled(response.data))
    })
    .catch(error => dispatch(checkUserError()));
};