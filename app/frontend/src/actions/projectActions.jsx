import axios from "axios";


export const getProjectStart = () => {
    return {type: 'GET_PROJECT'};
};

export const getProjectFulfilled = (payload) => {
    return {type: 'GET_PROJECT_FULFILLED', payload };
};

export const getProjectError = (payload) => {
    return {type: 'GET_PROJECT_ERROR', payload};
};

export const getProject = (name) => (dispatch, getState) => {
    dispatch(getProjectStart());
    var state = getState();
    return axios.get('/api/projects/users/' + state.user.username+ '/projects/' + name + '?status=true')
    .then(response => dispatch(getProjectFulfilled(response.data)))
    .catch(error => dispatch(getProjectError(error.response)));
};

