import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getProject } from '../../actions/projectActions.jsx';
import { saveFile, viewProjectNewTab, viewProjectinEditor } from '../../actions/filesActions.jsx';
import { toggleDirectoryView } from '../../actions/directoryTreeActions.jsx';

import Loader from '../shared/Loader.jsx';
import DirectoryTree from './DirectoryTree.jsx'


import Editor from './Editor.jsx';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';




import AppBar from 'material-ui/AppBar';

class Project extends React.Component {
    constructor(props) {
        super(props);
        props.getProject(props.params.project);
    }


    render() {
        if (this.props.isLoading) return <Loader />

        const iconStyles = {color: 'white', marginTop: 8};
        const iconPush = this.props.directoryViewOpen ? {margin: '0 230px 0 0'} : {};

        return <div>
            <AppBar
                title={this.props.metadata.project_name}
                titleStyle={{fontFamily: 'Indie Flower', fontSize: '2.4em'}}
                iconElementLeft={<IconButton containerElement={<Link to='/'/>}  iconClassName="fa fa-arrow-left"></IconButton>}>

                <IconMenu
                    iconButtonElement={<IconButton iconClassName="fa fa-eye" iconStyle={iconStyles} />}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'middle'}}>
                    <MenuItem onTouchTap={this.props.viewProjectinEditor} value="1" primaryText="Open in editor tab" />
                    <MenuItem onTouchTap={this.props.viewProjectNewTab} value="2" primaryText="Open in browser tab" />
                </IconMenu>

                
                <IconButton disabled={!this.props.canSave} onTouchTap={this.props.saveFile} style={iconPush} iconClassName="fa fa-floppy-o" iconStyle={{...iconStyles, color: !this.props.canSave ? 'gray' : 'white'}} />
                <IconButton onTouchTap={this.props.toggleDirectoryView} iconClassName="fa fa-folder" iconStyle={iconStyles} />
            </AppBar>
            <DirectoryTree open={this.props.directoryViewOpen} 
                           onClose={this.props.toggleDirectoryView}/>
                           
            <Editor />
        </div>
    }
}


const mapStateToProps = (state) => {
  return {
    metadata: state.project.metadata,
    isLoading: state.project.loading,
    canSave: state.files.open.length > 0 && state.files.open[state.files.active].dirty,
    directoryViewOpen: state.directoryTree.open
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProject: (name) => {
            dispatch(getProject(name))
        },
        saveFile: () => {
            dispatch(saveFile())
        },
        viewProjectNewTab: () => {
            dispatch(viewProjectNewTab())
        },
        viewProjectinEditor: () => {
            dispatch(viewProjectinEditor())
        },
        toggleDirectoryView: () => {
            dispatch(toggleDirectoryView())
        }

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);