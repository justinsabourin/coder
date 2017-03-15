import React from 'react';
import { connect } from 'react-redux';

import { getProject } from '../../actions/projectActions.jsx';

import Loader from '../shared/Loader.jsx';
import DirectoryTree from './DirectoryTree.jsx'


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
                           onClose={this.toggleDirectoryTree.bind(this, false)}/>
                           
            <Editor />
        </div>
    }
}


const mapStateToProps = (state) => {
  return {
    metadata: state.project.metadata,
    isLoading: state.project.loading
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProject: (name) => {
            dispatch(getProject(name))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);