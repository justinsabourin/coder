import React from 'react';
import { connect } from 'react-redux';

import { getProjects, createProject } from '../../actions/projectsActions.jsx';
import { userLogout } from '../../actions/userActions.jsx';
import { toggleCreate } from '../../actions/uiActions.jsx';

import ProjectList from './ProjectList.jsx';
import Loader from '../shared/Loader.jsx';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';


class Projects extends React.Component {
    constructor(props) {
        super(props);
        props.getProjects();
        this.state =  {
            projectName: "",
            projectNameError: null,
        };
    }

    handleClose() {
        this.setState({ projectName: "", projectNameError: null });
        this.props.toggleCreate();
    }

    createProject() {
        var projectName = this.state.projectName;
        if (projectName.length < 2 || projectName.length > 15) {
            return this.setState({ projectNameError: "Project name must be between 2 and 15 characters" })
        } else if (!/^[0-9a-zA-Z]+$/.test(projectName)) {
            this.setState({ projectNameError: "Project name must be alphanumeric" });
        } else {
            this.setState({ projectName: "", projectNameError: null });
            this.props.createProject(this.state.projectName);
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}
            />,
            <FlatButton
                label="Create Project"
                primary={true}
                onTouchTap={this.createProject.bind(this)}
            />,
        ];

        const projectNameError = this.state.projectNameError || this.props.ui.createError;

        let projectsDisplay;
        if (this.props.isLoading) {
            projectsDisplay = <Loader />;
        } else if (this.props.projects.length === 0){
            var message = this.props.errorMessage || "No Projects";
            projectsDisplay = <h3 className="empty-projects-message">
                {message}
            </h3>;
        } else {
            projectsDisplay = <ProjectList projects={this.props.projects} />
        }
        return <div>
            <AppBar
                title="Projects"
                titleStyle={{fontFamily: 'Open Sans', fontSize: '2.4em'}}
                iconElementRight={<FlatButton
                                    label="New Project"
                                    icon={<FontIcon className="fa fa-plus" />}
                                    onTouchTap={this.props.toggleCreate}
                                    /> }
                iconElementLeft={<IconButton
                                    iconClassName="fa fa-sign-out"
                                    onTouchTap={this.props.logOut}
                                    tooltip="Sign out"
                                    /> }
                
            />
            {projectsDisplay}
            
            <Dialog
                title="Create Project"
                actions={actions}
                modal={true}
                open={this.props.ui.createOpen}
                >
                <TextField
                        hintText="Project Name"
                        value={this.state.projectName}
                        onChange={(e) => this.setState({ projectName: e.target.value })}
                        floatingLabelText="Project Name"
                        errorText={projectNameError}
                        floatingLabelStyle={{fontFamily: 'Open Sans', fontSize: '1.7em'}}
                    />
            </Dialog>
        </div>;
    }
}



const mapStateToProps = (state) => {
  return {
    projects: state.projects.list,
    isLoading: state.projects.loading,
    errorMessage: state.projects.error,
    ui: state.ui.projects
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProjects: () => {
            dispatch(getProjects())
        },
        createProject: (project) => {
            dispatch(createProject(project))
        },
        logOut: () => {
            dispatch(userLogout());
        },
        toggleCreate: () => {
            dispatch(toggleCreate())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);