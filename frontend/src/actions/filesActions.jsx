import axios from "axios";

export const updateFileContents = (updatedContents) => ({type: 'UPDATE_FILE_CONTENTS', payload: updatedContents});

export const switchTab = (newTab) => {
    return {type: 'SWITCH_TAB', payload: newTab}
}

export const closeTab = (tab) => {
    return {type: 'CLOSE_TAB', payload: tab}
}

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
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    var index = state.files.open.findIndex((file) => file.path === path);
        if (index === -1) {
            dispatch(openFileStart());
        } else {
            switchTab(index);
            return;
        }
    return axios.get(`/api/projects/user/${creator}/projects/${project_name}${path}`)
    .then(response => dispatch(openFileFulfilled(response.data)))
    .catch(error => dispatch(openFileError(error.response)));
};