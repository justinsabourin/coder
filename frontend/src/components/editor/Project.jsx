import React from 'react';
import { getProject } from '../../actions/projectActions.jsx';
import Loader from '../shared/Loader.jsx';
import DirectoryTree from './DirectoryTree.jsx'

import { connect } from 'react-redux';
import Editor from './Editor.jsx';
import IconButton from 'material-ui/IconButton';



import AppBar from 'material-ui/AppBar';

class Project extends React.Component {
    constructor(props) {
        super(props);
        props.getProject(props.params.project, props.user);
        this.state = {
            open: false
        };
    }

    toggleDirectoryTree(bool) {
        this.setState({open: bool})
    }

    render() {
        if (this.props.isLoading) return <Loader />
        const fil = {
            active: 3,
            open: [{
                name: 'index.html',
            },
            {
                name: 'index.html',
            },
            {
                name: 'index.html',
            },
            {
                name: 'index.html',
            }]
        }
        return <div>
            <AppBar
                title={this.props.metadata.project_name}
                titleStyle={{fontFamily: 'Indie Flower', fontSize: '2.4em'}}
                showMenuIconButton={false}
                iconElementRight={<IconButton iconClassName="fa fa-folder" iconStyle={{color: 'white'}} />}
                onRightIconButtonTouchTap={this.toggleDirectoryTree.bind(this,true)}
            />
            <DirectoryTree open={this.state.open} tree={this.props.directoryTree} onClose={this.toggleDirectoryTree.bind(this, false)}/>
            <Editor files={fil}/>
        </div>
    }
}


const mapStateToProps = (state) => {
  return {
    directoryTree: state.project.directoryTree,
    files: state.project.files,
    metadata: state.project.metadata,
    user: state.user.username,
    isLoading: state.project.loading
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProject: (name, creator) => {
            dispatch(getProject(name, creator))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);