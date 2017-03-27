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
    return axios.get(`/api/projects/users/${creator}/projects/${project_name}/path/${path}`)
    .then(response => dispatch(openFileFulfilled(response.data)))
    .catch(error => dispatch(openFileError(error.response)));
};


export const saveFileStart = () => {
    return {type: 'SAVE_FILE'};
};

export const saveFileFulfilled = (payload) => {
    return {type: 'SAVE_FILE_FULFILLED', payload };
};

export const saveFileError = (payload) => {
    return {type: 'SAVE_FILE_ERROR', payload};
};

export const saveFile = () => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    var { path, contents } = state.files.open[state.files.active];
    dispatch(saveFileStart());

    return axios.patch(`/api/projects/users/${creator}/projects/${project_name}/path/${path}?status=true`, {contents})
    .then(response => dispatch(saveFileFulfilled(response.data)))
    .catch(error => dispatch(saveFileError(error.response)));
};


export const viewProjectNewTab = () => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    window.open(`/staticcontent/users/${creator}/projects/${project_name}/`, '_blank');
}

export const viewProjectinEditor = () => (dispatch, getState) => {
    var state = getState();
    var { creator, project_name } = state.project.metadata;
    dispatch({
        type: 'OPEN_FILE_FULFILLED', 
        payload: {
            path: `/staticcontent/users/${creator}/projects/${project_name}/`,
            node_type: 'IFR',
            name: 'Preview'
        }
    });
}