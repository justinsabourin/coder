import axios from "axios";

export const toggleGitView = () => ({ type: "TOGGLE_GIT_VIEW" });

export const selectFileForStage = path => ({
  type: "SELECT_FILE_FOR_STAGE",
  payload: path
});

export const commitFilesFulfilled = payload => {
  return { type: "COMMIT_FILES_FULFILLED", payload };
};

export const commitFilesError = payload => {
  return { type: "COMMIT_FILES_ERROR", payload };
};

export const commitFiles = message => (dispatch, getState) => {
  let state = getState();
  let { creator, project_name } = state.project.metadata;
  return axios
    .post(
      `/api/projects/users/${creator}/projects/${project_name}/commit?status=true`,
      { message }
    )
    .then(response => dispatch(commitFilesFulfilled(response.data)))
    .catch(error => dispatch(commitFilesError(error.response)));
};

export const stageFilesFulfilled = payload => {
  return { type: "STAGE_FILES_FULFILLED", payload };
};

export const stageFilesError = payload => {
  return { type: "STAGE_FILES_ERROR", payload };
};

export const stageFiles = () => (dispatch, getState) => {
  let state = getState();
  let { creator, project_name } = state.project.metadata;
  let files = Object.values(state.git.status.unstaged).reduce((accum, stat) => {
    if (stat.selectedForStage) accum.push({ path: stat.path, type: stat.type });
    return accum;
  }, []);
  return axios
    .post(
      `/api/projects/users/${creator}/projects/${project_name}/stage?status=true`,
      { files }
    )
    .then(response => dispatch(stageFilesFulfilled(response.data)))
    .catch(error => dispatch(stageFilesError(error.response)));
};
