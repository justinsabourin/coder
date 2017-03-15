const reducer = function(state={
    metadata: {},
    loading: false,
}, action) {
    switch(action.type) {
        case 'GET_PROJECT':
            return {...state, loading: true}
        case 'GET_PROJECT_FULFILLED':
            const metadata = {...state.metadata, creator: action.payload.creator, project_name: action.payload.project_name};
            return {...state, loading: false, directoryTree: action.payload.files, metadata}    
    }
    return state;
}

export default reducer;