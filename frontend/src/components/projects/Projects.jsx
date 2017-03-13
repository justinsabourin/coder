import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getProjects, createProject } from '../../actions/projectsActions.jsx'
import Loader from '../shared/Loader.jsx';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        props.getProjects(props.user);
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
        this.props.createProject({name: this.name.input.value, username: this.props.user});
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
        const styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                marginTop: 40
            },
            gridList: {
                width: 500,
                height: 450,
                overflowY: 'auto',
            },
        };
        let projectsDisplay;
        if (this.props.isLoading) {
            projectsDisplay = <Loader />;
        } else if (this.props.projects === []){
            var message = this.props.errorMessage || "No Projects";
            projectsDisplay = <h3 style={{fontFamily: 'Roboto', textAlign: 'center', marginTop: '40px', color: 'gray'}}>
                {message}
            </h3>;
        } else {
            projectsDisplay = <div style={styles.root}>
                <GridList style={styles.gridList}>
                    {this.props.projects.map((project) => (
                        <GridTile
                        key={project.project_name}
                        title={project.project_name}
                        subtitle={<span>by <b>{project.creator}</b></span>}
                        actionIcon={<IconButton containerElement={<Link to={'/' + project.project_name}/>} iconStyle={{color: 'white'}} iconClassName="fa fa-folder-open"></IconButton>}
                        >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/63/Code_vmc2015.png"/>
                        </GridTile>
                    ))}
                </GridList>
            </div>
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
    user: state.user.username,
    isLoading: state.projects.loading,
    errorMessage: state.projects.error
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProjects: (username) => {
            dispatch(getProjects(username))
        },
        createProject: (project) => {
            dispatch(createProject(project))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);