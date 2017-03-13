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

export const getProject = (name, creator) => (dispatch) => {
    dispatch(getProjectStart());

    return axios.get('/api/projects/user/' + creator + '/projects/' + name)
    .then(response => dispatch(getProjectFulfilled(response.data)))
    .catch(error => dispatch(getProjectError(error.response)));
};