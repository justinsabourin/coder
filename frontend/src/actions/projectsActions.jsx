import axios from "axios";


export const getProjectsStart = () => {
    return {type: 'GET_PROJECTS'};
};

export const getProjectsFulfilled = (payload) => {
    return {type: 'GET_PROJECTS_FULFILLED', payload };
};

export const getProjectsError = (payload) => {
    return {type: 'GET_PROJECTS_ERROR', payload};
};

export const getProjects = () => (dispatch, getState) => {
    dispatch(getProjectsStart());
    var state = getState();
    return axios.get('/api/projects/user/' + state.user.username + '/projects')
    .then(response => dispatch(getProjectsFulfilled(response.data)))
    .catch(error => dispatch(getProjectsError(error.response)));
};

export const createProjectStart = () => {
    return {type: 'CREATE_PROJECT'};
};

export const createProjectFulfilled = (payload) => {
    return {type: 'CREATE_PROJECT_FULFILLED', payload };
};

export const createProjectError = (payload) => {
    return {type: 'CREATE_PROJECT_ERROR', payload};
};

export const createProject = (projectName) => (dispatch, getState) => {
    dispatch(createProjectStart());
    var state = getState();
    return axios.post('/api/projects/user/' + state.user.username + '/projects', {project_name: projectName})
    .then(response => dispatch(createProjectFulfilled(response.data)))
    .catch(error => dispatch(createProjectError(error.response)));
};