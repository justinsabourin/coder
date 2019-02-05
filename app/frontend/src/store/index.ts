import { combineReducers, Dispatch, Reducer, Action, AnyAction } from "redux";
import { UserState, user } from "./user";
import { ProjectsState, projects } from "./projects";
import { FilesState, files } from "./files";
import { ProjectState, project } from "./project";
import { DirectoryTreeState, directoryTree } from "./directoryTree";
import { UIState, ui } from "./ui";
import { GitState, git } from "./git";

// The top-level state object.
//
// `connected-react-router` already injects the router state typings for us,
// so we can ignore them here.
export interface ApplicationState {
  user: UserState;
  projects: ProjectsState;
  files: FilesState;
  directoryTree: DirectoryTreeState;
  project: ProjectState;
  ui: UIState;
  git: GitState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<ApplicationState>({
  user,
  projects,
  files,
  directoryTree,
  project,
  ui,
  git
});
