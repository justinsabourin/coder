const reducer = function(state={
    directoryTree: {},
    metadata: {},
    files: {
        active: null,
        open: []
    },
    loading: false,
}, action) {
    switch(action.type) {
        case 'GET_PROJECT':
            return {...state, loading: true}
        case 'GET_PROJECT_FULFILLED':
            const metadata = {...state.metadata, creator: action.payload.creator, project_name: action.payload.project_name};
            return {...state, loading: false, directoryTree: action.payload.files, metadata}
        case 'OPEN_FILE_FULFILLED':
            return {...state, files: {
                active: 0,
                open: [action.payload].concat(state.files.open)
            }}
        case 'ADD_FILE_FULFILLED':
            var path = action.payload.path.slice(0, action.payload.path.lastIndexOf('/'));
            var parent = state.directoryTree[path];
            var newState = {
                ...state, 
                directoryTree: {
                    ...state.directoryTree, 
                    [action.payload.path]: action.payload
                }
            }
            if (parent) {
                newState.directoryTree[path] = {
                    ...parent,
                    children: parent.children.concat(action.payload.path)
                } 
            }
            return newState;
        case 'DELETE_FILE_FULFILLED':
            var directoryTree = {...state.directoryTree}
            delete directoryTree[action.payload]
            var index = state.files.open.findIndex((file) => file.path === action.payload);
            if (index === -1) {
                return {...state, directoryTree}
            }
            return {...state, directoryTree, files: {
                active: index === state.files.active ? 
                        (index === 0 ? index : index - 1) : 
                        (state.files.active < index ? state.files.active : state.files.active - 1),
                open: state.files.open.slice(0, index).concat(state.files.open.slice(index + 1))
            }} 
        case 'UPDATE_FILE_CONTENTS': 
            var openCopy = [...state.files.open]
            openCopy[state.files.active] = {
                ...state.files.open[state.files.active],
                contents: action.payload,
                dirty: true
            } 
            return {
                ...state,
                files: {
                    ...state.files,
                    open: openCopy
                }
            }
        case 'SWITCH_TAB':
            return {...state, files: {...state.files, active: action.payload}}
        case 'CLOSE_TAB':
            return {...state, files: {
                active: action.payload === 0 ? action.payload : action.payload - 1,
                open: state.files.open.slice(0, action.payload).concat(state.files.open.slice(action.payload + 1))
            }}
        
    }
    return state;
}

export default reducer;