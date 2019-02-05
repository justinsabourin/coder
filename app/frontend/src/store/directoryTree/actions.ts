import { action } from "typesafe-actions";
import { DirectoryTreeActionTypes, AddFile } from "./types";

export const addFile = () => action(DirectoryTreeActionTypes.ADD_FILE);

export const addFileFulfilled = (data: AddFile) =>
  action(DirectoryTreeActionTypes.ADD_FILE_FULFILLED, data);
export const addFileError = (message: string) =>
  action(DirectoryTreeActionTypes.ADD_FILE_ERROR, message);

export const deleteFile = () => action(DirectoryTreeActionTypes.DELETE_FILE);

export const deleteFileFulfilled = (data: AddFile) =>
  action(DirectoryTreeActionTypes.DELETE_FILE_FULFILLED, data);
export const deleteFileError = (message: string) =>
  action(DirectoryTreeActionTypes.DELETE_FILE_ERROR, message);

export const startFileAdd = () =>
  action(DirectoryTreeActionTypes.START_FILE_ADD);
export const terminateFileAdd = () =>
  action(DirectoryTreeActionTypes.TERMINATE_FILE_ADD);
export const selectFile = () => action(DirectoryTreeActionTypes.SELECT_FILE);
export const toggleDirectoryView = () =>
  action(DirectoryTreeActionTypes.TOGGLE_DIRECTORY_VIEW);
