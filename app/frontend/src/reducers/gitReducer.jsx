const reducer = function(state={
    open: false,
    status: {},

}, action) {
    switch(action.type) {
        case 'GET_PROJECT_FULFILLED':
            return {...state, status: action.payload.status}
        case 'COMMIT_FILES_FULFILLED':
        case 'ADD_FILE_FULFILLED':
        case 'SAVE_FILE_FULFILLED':
        case 'DELETE_FILE_FULFILLED':
            var status = state.status;
            return {
                ...state, 
                status: Object.keys(action.payload.status).reduce((accum, stat) => {
                    if (status[stat] && status[stat].type === action.payload.status[stat].type){
                        accum[stat] = status[stat]
                    } else {
                        accum[stat] = action.payload.status[stat]
                    }
                    return accum;
                }, {})
            };
        case 'TOGGLE_GIT_VIEW':
            return {...state, open: !state.open}
        case 'TOGGLE_GIT_STATUS':
            if (action.payload === 'all' || action.payload === 'none') {
                return {...state, status: Object.values(state.status).reduce((accum, stat) => {
                    var newStat = {...stat};
                    newStat.selected = action.payload === 'all';
                    accum[newStat.path] = newStat;
                    return accum;
                }, {}) }
            }
            return {
                ...state, 
                status: Object.values(state.status).reduce((accum, stat) => {
                    var newStat = {...stat};
                    newStat.selected = action.payload[newStat.path];
                    accum[newStat.path] = newStat;
                    return accum;
                }, {}) 
            }
    }
    return state;
}

export default reducer;