import axios from "axios";

export const toggleGitView = () => ({ type: 'TOGGLE_GIT_VIEW' });

export const toggleGitStatus = (path) => ({type: 'TOGGLE_GIT_STATUS', payload: path});

export const commitFilesFulfilled = (payload) => {
    return {type: 'COMMIT_FILES_FULFILLED', payload };
};

export const commitFilesError = (payload) => {
    return {type: 'COMMIT_FILES_ERROR', payload};
};

export const commitFiles = (message) => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    var files = Object.values(state.git.status).reduce((accum, stat) => {
        if (stat.selected) accum.push({path: stat.path, type: stat.type})
        return accum;
    }, []);
    return axios.post(`/api/projects/users/${creator}/projects/${project_name}/commit?status=true`, {files, message})
    .then(response => dispatch(commitFilesFulfilled(response.data)))
    .catch(error => dispatch(commitFilesError(error.response)));
};