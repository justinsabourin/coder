const reducer = function(state={
    username: null,
    auth: {
        isLoggedIn: false,
        isLoggingIn: false,
        error: null
    }
}, action) {
    let newAuth;
    switch(action.type) {
        case 'CHECK_USER':
        case 'SIGNUP_USER':
        case 'LOGIN_USER':
            newAuth = {...state.auth, isLoggingIn: true }
            return {...state, auth: newAuth}
        case 'CHECK_USER_ERROR':
        case 'SIGNUP_USER_ERROR':
        case 'LOGIN_USER_ERROR':
            newAuth = {...state.auth, isLoggingIn: false, error: 'ERROR!' }
            return {...state, auth: newAuth }
        case 'CHECK_USER_FULFILLED':
        case 'SIGNUP_USER_FULFILLED':
        case 'LOGIN_USER_FULFILLED': 
            newAuth = {...state.auth, isLoggingIn: false, isLoggedIn: true, error: null}
            return {...state, username: action.payload.username, auth: newAuth}
        case 'LOG_OUT':
            return {
                username: null,
                auth: {
                    isLoggedIn: false,
                    isLoggingIn: false,
                    error: null
                }
            }
    }
    return state;
}

export default reducer;