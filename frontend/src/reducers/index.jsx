import { combineReducers } from "redux";

import user from "./userReducer.jsx";
import projects from "./projectsReducer.jsx";
import editor from "./editorReducer.jsx";
import project from './projectReducer.jsx';

export default combineReducers({
    user,
    projects,
    editor,
    project,
});
