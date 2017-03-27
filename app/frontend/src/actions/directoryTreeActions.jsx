import axios from "axios";


export const startFileAdd = (type) => ({ type: 'START_FILE_ADD', payload: {type} })

export const terminateFileAdd = () => ({ type: 'TERMINATE_FILE_ADD'})

export const selectFile = (path, type) => ({ type: 'SELECT_FILE', payload: {path, type} })

export const toggleDirectoryView = () => ({ type: 'TOGGLE_DIRECTORY_VIEW' });

export const addFileFulfilled = (payload) => {
    return {type: 'ADD_FILE_FULFILLED', payload };
};

export const addFileError = (payload) => {
    return {type: 'ADD_FILE_ERROR', payload};
};

export const addFile = (path) => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    var type = state.directoryTree.newFile.type
    return axios.put(`/api/projects/users/${creator}/projects/${project_name}/path/${path}?status=true`, {type})
    .then(response => dispatch(addFileFulfilled(response.data)))
    .catch(error => dispatch(addFileError(error.response)));
};

export const deleteFileFulfilled = (payload) => {
    return {type: 'DELETE_FILE_FULFILLED', payload };
};

export const deleteFileError = (payload) => {
    return {type: 'DELETE_FILE_ERROR', payload};
};

export const deleteFile = () => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    var path = state.directoryTree.selected.path;
    return axios.delete(`/api/projects/users/${creator}/projects/${project_name}/path/${path}?status=true`)
    .then(response => dispatch(deleteFileFulfilled({...response.data, path})))
    .catch(error => dispatch(deleteFileError(error.response)));
};