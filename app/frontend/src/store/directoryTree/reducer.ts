import { Reducer } from "redux";
import { DirectoryTreeState, DirectoryTreeActionTypes } from "./types";

const initialState: DirectoryTreeState = {
  selected: null,
  tree: {},
  newFile: null,
  open: true
};

const reducer: Reducer<DirectoryTreeState> = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PROJECT_FULFILLED": {
      return { ...state, tree: action.payload.files };
    }
    case DirectoryTreeActionTypes.ADD_FILE_FULFILLED: {
      let path = action.payload.path.slice(
        0,
        action.payload.path.lastIndexOf("/")
      );
      let parent = state.tree[path];
      return {
        ...state,
        newFile: null,
        tree: {
          ...state.tree,
          [action.payload.path]: { ...action.paylod, status: undefined },
          [path]: parent && {
            ...parent,
            children: (parent.children &&
              parent.children.concat(action.payload.path)) || [
              action.payload.path
            ]
          }
        }
      };
    }
    case DirectoryTreeActionTypes.DELETE_FILE_FULFILLED: {
      let tree = { ...state.tree };
      delete tree[action.payload.path];
      let path = action.payload.path.slice(
        0,
        action.payload.path.lastIndexOf("/")
      );
      let parent = state.tree[path];
      return {
        ...state,
        selected: null,
        tree: {
          ...tree,
          [path]: parent && {
            ...parent,
            children: parent.children.filter(
              (file: string) => file !== action.payload.path
            )
          }
        }
      };
    }
    case DirectoryTreeActionTypes.START_FILE_ADD: {
      return {
        ...state,
        newFile: action.payload,
        tree: state.selected
          ? {
              ...state.tree,
              [state.selected.path]: {
                ...state.tree[state.selected.path],
                open: true
              }
            }
          : state.tree
      };
    }
    case DirectoryTreeActionTypes.TERMINATE_FILE_ADD: {
      return {
        ...state,
        newFile: null
      };
    }
    case DirectoryTreeActionTypes.SELECT_FILE: {
      return {
        ...state,
        selected: action.payload,
        newFile: null,
        tree:
          action.payload.type === "D"
            ? {
                ...state.tree,
                [action.payload.path]: {
                  ...state.tree[action.payload.path],
                  open: !state.tree[action.payload.path].open
                }
              }
            : state.tree
      };
    }
    case DirectoryTreeActionTypes.TOGGLE_DIRECTORY_VIEW: {
      return { ...state, open: !state.open };
    }
  }
};

export { reducer as directoryTree };
