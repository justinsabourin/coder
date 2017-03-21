const reducer = function(state={
    list: [],
    loading: false,
    error: null

}, action) {
    switch(action.type) {
        case 'GET_PROJECTS':
            return {...state, loading: true};
        case 'GET_PROJECTS_FULFILLED':
            return {...state, list: action.payload.list, loading: false}
        case 'GET_PROJECTS_ERROR':
            return {...state, loading: false, error: 'Unable to load projects'};
        case 'CREATE_PROJECT_FULFILLED':
            return {...state, loading: false, list: [action.payload].concat(state.list)}
    }
    return state;
}

export default reducer;