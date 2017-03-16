const reducer = function(state={
    selected: {},
    tree: {},
    newFile: {},
    open: false
}, action) {
    switch(action.type) {
        case 'GET_PROJECT_FULFILLED':
            return {...state, tree: action.payload.files}
        case 'ADD_FILE_FULFILLED':
            var path = action.payload.path.slice(0, action.payload.path.lastIndexOf('/'));
            var parent = state.tree[path];
            var newState = {
                    ...state,
                    newFile: {},
                    tree: {
                        ...state.tree,
                        [action.payload.path]: action.payload
                    }
            }
            if (parent) {
                newState.tree[path] = {
                    ...parent,
                    children: parent.children.concat(action.payload.path)
                } 
            }
            return newState;
        case 'DELETE_FILE_FULFILLED':
            var tree = {...state.tree}
            delete tree[action.payload]
            var path = action.payload.slice(0, action.payload.lastIndexOf('/'));
            var parent = state.tree[path];
            var newState = {
                    ...state,
                    selected: {},
                    tree
            }
            if (parent) {
                newState.tree[path] = {
                    ...parent,
                    children: parent.children.filter((file) => file !== action.payload)
                } 
            }
            return newState;
            return {...state, selected: {}, tree}
        case 'START_FILE_ADD':
            var newState = {
                ...state,
                newFile: action.payload,
            }
            if (state.selected.path) {
                newState.tree = {
                    ...state.tree,
                    [state.selected.path] : {
                        ...state.tree[state.selected.path],
                        open: true
                    }
                }
            }
            return newState;
        case 'TERMINATE_FILE_ADD':
            return {
                ...state,
                newFile: {}
            }
        case 'SELECT_FILE':
            if (action.payload.type === 'D') {
                return {
                    ...state,
                    selected: action.payload,
                    newFile: {},
                    tree: {
                        ...state.tree,
                        [action.payload.path] : {
                            ...state.tree[action.payload.path],
                            open: !state.tree[action.payload.path].open
                        }
                    }
                }
            } else {
                return {...state, newFile: {}, selected: action.payload};
            }
        case 'TOGGLE_DIRECTORY_VIEW':
            return {...state, open: !state.open}

    }
    return state;
}

export default reducer;