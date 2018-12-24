const reducer = function(
  state = {
    open: false,
    status: {
      staged: {},
      unstaged: {}
    }
  },
  action
) {
  switch (action.type) {
    case "GET_PROJECT_FULFILLED":
      return { ...state, status: action.payload.status };
    case "COMMIT_FILES_FULFILLED":
    case "STAGE_FILES_FULFILLED":
    case "ADD_FILE_FULFILLED":
    case "SAVE_FILE_FULFILLED":
    case "DELETE_FILE_FULFILLED":
      return {
        ...state,
        status: action.payload.status
      };
    case "TOGGLE_GIT_VIEW":
      return { ...state, open: !state.open };
    case "SELECT_FILE_FOR_STAGE":
      return {
        ...state,
        status: {
          ...state.status,
          unstaged: Object.values(state.status.unstaged).reduce(
            (accum, stat) => ({
              ...accum,
              [stat.path]: {
                ...stat,
                selectedForStage:
                  action.payload !== "none" &&
                  (action.payload === "all" ||
                    (action.payload === stat.path && !stat.selectedForStage) ||
                    (stat.selectedForStage && action.payload !== stat.path))
              }
            }),
            {}
          )
        }
      };
  }
  return state;
};

export default reducer;
