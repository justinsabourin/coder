const reducer = function(state={
    authenticationError: {},
    projects: {
        createOpen: false
    }
}, action) {
    var data = action.payload && action.payload.data;
    switch(action.type) {
        case 'SIGNUP_USER_ERROR':
        case 'LOGIN_USER_ERROR':
            return {
                ...state,
                authenticationError: {
                    username: data.type === 'username' ? data.message : null,
                    password: data.type === 'password' ? data.message: null,
                }
            }
        case 'SIGNUP_USER_FULFILLED':
        case 'LOGIN_USER_FULFILLED':
        case 'CLEAR_AUTH':
            return {...state, authenticationError: {}}
        case 'PROJECT_TOGGLE_CREATE':
            return {...state, projects: {...state.projects, createOpen: !state.projects.createOpen, createError: null}}
        case 'CREATE_PROJECT_FULFILLED':
            return {...state, projects: {...state.projects, createOpen: false}}
        case 'CREATE_PROJECT_ERROR':
            var error = action.payload.data.message;
            return {...state, projects: {...state.projects, createError: error}}

        
    }
    return state;
}

export default reducer;