// Response object for GET
export interface AddFile {
  project_name: string;
  creator: string;
  name: string;
  path: string;
  node_type: "F" | "D";
  file_type?: string;
  contents?: string;
  // status?:
}

// This type is basically shorthand for `{ [key: string]: any }`. Feel free to replace `any` with
// the expected return type of your API response.
export type ApiResponse = Record<string, any>;

export const enum DirectoryTreeActionTypes {
  START_FILE_ADD = "@@directoryTree/START_FILE_ADD",
  TERMINATE_FILE_ADD = "@@directoryTree/TERMINATE_FILE_ADD",
  SELECT_FILE = "@@directoryTree/SELECT_FILE",
  TOGGLE_DIRECTORY_VIEW = "@@directoryTree/TOGGLE_DIRECTORY_VIEW",
  ADD_FILE_FULFILLED = "@@directoryTree/ADD_FILE_FULFILLED",
  ADD_FILE_ERROR = "@@directoryTree/ADD_FILE_ERROR",
  ADD_FILE = "@@directoryTree/ADD_FILE",
  DELETE_FILE = "@@directoryTree/DELETE_FILE",
  DELETE_FILE_FULFILLED = "@@directoryTree/DELETE_FILE_FULFILLED",
  DELETE_FILE_ERROR = "@@directoryTree/DELETE_FILE_ERROR"
}

interface FileInfo {
  name: string;
  path: string;
  node_type: "F" | "D";
  file_type?: string;
  children?: string[];
  open?: boolean;
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface DirectoryTreeState {
  readonly selected: FileInfo;
  readonly tree: {
    [key: string]: FileInfo;
  };
  readonly newFile: { type: "F" | "D" };
  readonly open: boolean;
}
