import React from 'react';
import { getProject, openFile, switchTab, closeTab, addFile, deleteFile, updateFileContents } from '../../actions/projectActions.jsx';
import Loader from '../shared/Loader.jsx';
import DirectoryTree from './DirectoryTree.jsx'

import { connect } from 'react-redux';
import Editor from './Editor.jsx';
import IconButton from 'material-ui/IconButton';




import AppBar from 'material-ui/AppBar';

class Project extends React.Component {
    constructor(props) {
        super(props);
        props.getProject(props.params.project);
        this.state = {
            open: false
        };
    }

    openFile(path) {
        var index = this.props.files.open.findIndex((file) => file.path === path);
        if (index === -1) {
            this.props.openFile(path);
        } else {
            this.props.switchTab(index);
        }
    }

    toggleDirectoryTree(bool) {
        this.setState({open: bool})
    }

    render() {
        if (this.props.isLoading) return <Loader />

        return <div>
            <AppBar
                title={this.props.metadata.project_name}
                titleStyle={{fontFamily: 'Indie Flower', fontSize: '2.4em'}}
                showMenuIconButton={false}
                iconElementRight={<IconButton iconClassName="fa fa-folder" iconStyle={{color: 'white'}} />}
                onRightIconButtonTouchTap={this.toggleDirectoryTree.bind(this,true)}
            />
            <DirectoryTree open={this.state.open} 
                           tree={this.props.directoryTree} 
                           onClose={this.toggleDirectoryTree.bind(this, false)}
                           openFile={this.openFile.bind(this)}
                           addFile={this.props.addFile}
                           deleteFile={this.props.deleteFile}/>
            <Editor files={this.props.files} 
                    switchTab={this.props.switchTab}
                    closeTab={this.props.closeTab}
                    updateFile={this.props.updateFile}
                    />
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
        getProject: (name) => {
            dispatch(getProject(name))
        },
        openFile: (path) => {
            dispatch(openFile(path))
        },
        switchTab: (newTab) => {
            dispatch(switchTab(newTab))
        },
        closeTab: (tab) => {
            dispatch(closeTab(tab))
        },
        addFile: (path, type) => {
            dispatch(addFile(path,type))
        },
        deleteFile: (path) => {
            dispatch(deleteFile(path))
        },
        updateFile: (contents) => {
            dispatch(updateFileContents(contents));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);