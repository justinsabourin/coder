import { combineReducers } from "redux";

import user from "./userReducer.jsx";
import projects from "./projectsReducer.jsx";
import files from "./filesReducer.jsx";
import project from './projectReducer.jsx';
import directoryTree from './directoryTreeReducer.jsx'

export default combineReducers({
    user,
    projects,
    files,
    directoryTree,
    project,
});
