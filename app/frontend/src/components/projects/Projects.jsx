import React from 'react';
import { connect } from 'react-redux';

import { getProjects, createProject } from '../../actions/projectsActions.jsx'

import ProjectList from './ProjectList.jsx';
import Loader from '../shared/Loader.jsx';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';


class Projects extends React.Component {
    constructor(props) {
        super(props);
        props.getProjects();
        this.state =  {
            open: false,
        };
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

    createProject() {
        this.handleClose();
        this.props.createProject(this.name.input.value);
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
        let projectsDisplay;
        if (this.props.isLoading) {
            projectsDisplay = <Loader />;
        } else if (this.props.projects === []){
            var message = this.props.errorMessage || "No Projects";
            projectsDisplay = <h3 className=".empty-projects-message">
                {message}
            </h3>;
        } else {
            projectsDisplay = <ProjectList projects={this.props.projects} />
        }
        return <div>
            <AppBar
                title="Projects"
                titleStyle={{fontFamily: 'Indie Flower', fontSize: '2.4em'}}
                showMenuIconButton={false}
                iconElementRight={<FlatButton
                            label="New Project"
                            icon={<FontIcon className="fa fa-plus" />}
                            onTouchTap={this.handleOpen.bind(this)}
                            /> }
            />
            {projectsDisplay}
            
            <Dialog
                title="Create Project"
                actions={actions}
                modal={true}
                open={this.state.open}
                >
                <TextField
                        hintText="Project Name"
                        ref={(name) => this.name = name}
                        floatingLabelText="Project Name"
                        floatingLabelStyle={{fontFamily: 'Indie Flower', fontSize: '1.7em'}}
                    />
            </Dialog>
        </div>;
    }
}



const mapStateToProps = (state) => {
  return {
    projects: state.projects.list,
    isLoading: state.projects.loading,
    errorMessage: state.projects.error
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProjects: () => {
            dispatch(getProjects())
        },
        createProject: (project) => {
            dispatch(createProject(project))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);