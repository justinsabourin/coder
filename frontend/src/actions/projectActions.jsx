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
    return axios.get('/api/projects/user/' + state.user.username+ '/projects/' + name)
    .then(response => dispatch(getProjectFulfilled(response.data)))
    .catch(error => dispatch(getProjectError(error.response)));
};

export const openFileStart = () => {
    return {type: 'OPEN_FILE'};
};

export const openFileFulfilled = (payload) => {
    return {type: 'OPEN_FILE_FULFILLED', payload };
};

export const openFileError = (payload) => {
    return {type: 'OPEN_FILE_ERROR', payload};
};

export const openFile = (path) => (dispatch, getState) => {
    dispatch(openFileStart());
    var state = getState();
    return axios.get('/api/projects/user/' + state.project.metadata.creator + '/projects/' + state.project.metadata.project_name  + path)
    .then(response => dispatch(openFileFulfilled(response.data)))
    .catch(error => dispatch(openFileError(error.response)));
};

export const addFileFulfilled = (payload) => {
    return {type: 'ADD_FILE_FULFILLED', payload };
};

export const addFileError = (payload) => {
    return {type: 'ADD_FILE_ERROR', payload};
};

export const addFile = (path, type) => (dispatch, getState) => {
    var state = getState();
    return axios.put('/api/projects/user/' + state.project.metadata.creator + '/projects/' + state.project.metadata.project_name + path, {type})
    .then(response => dispatch(addFileFulfilled(response.data)))
    .catch(error => dispatch(addFileError(error.response)));
};

export const deleteFileFulfilled = (payload) => {
    return {type: 'DELETE_FILE_FULFILLED', payload };
};

export const deleteFileError = (payload) => {
    return {type: 'DELETE_FILE_ERROR', payload};
};

export const deleteFile = (path) => (dispatch, getState) => {
    var state = getState();
    return axios.delete('/api/projects/user/' + state.project.metadata.creator + '/projects/' + state.project.metadata.project_name + path)
    .then(response => dispatch(deleteFileFulfilled(path)))
    .catch(error => dispatch(deleteFileError(error.response)));
};

export const updateFileContents = (updatedContents) => ({type: 'UPDATE_FILE_CONTENTS', payload: updatedContents});

export const switchTab = (newTab) => {
    return {type: 'SWITCH_TAB', payload: newTab}
}

export const closeTab = (tab) => {
    return {type: 'CLOSE_TAB', payload: tab}
}