const reducer = function(state={
    active: null,
    open: []
}, action) {
    switch(action.type) {
        case 'OPEN_FILE_FULFILLED':
            return {
                ...state,
                active: 0,
                open: [action.payload].concat(state.open)
            }
        case 'DELETE_FILE_FULFILLED':
            var index = state.open.findIndex((file) => {
                if (file.node_type !== 'F') return false; 
                else return file.path === action.payload
            });
            if (index === -1) {
                return state;
            }
            return {
                ...state, 
                active: index === state.active ? 
                            (index === 0 ? index : index - 1) : 
                            (state.active < index ? state.active : state.active - 1),
                open: state.open.slice(0, index).concat(state.open.slice(index + 1))
                
            } 
        case 'UPDATE_FILE_CONTENTS': 
            var openCopy = [...state.open]
            openCopy[state.active] = {
                ...state.open[state.active],
                contents: action.payload,
                dirty: true
            } 
            return {
                ...state,
                open: openCopy
            }
        case 'SAVE_FILE':
            var openCopy = [...state.open]
            openCopy[state.active] = {
                ...state.open[state.active],
                dirty: false
            } 
            return {
                ...state,
                open: openCopy
            }
        case 'SWITCH_TAB':
            return {...state, active: action.payload}
        case 'CLOSE_TAB':
            return {
                ...state,
                active: action.payload === 0 ? action.payload : action.payload - 1,
                open: state.open.slice(0, action.payload).concat(state.open.slice(action.payload + 1))
            }
        
    }
    return state;
}

export default reducer;