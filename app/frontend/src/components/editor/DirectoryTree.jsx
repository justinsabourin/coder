import React from 'react';
import { connect } from 'react-redux';

import { addFile, startFileAdd, terminateFileAdd, deleteFile, selectFile } from '../../actions/directoryTreeActions.jsx';
import { openFile } from '../../actions/filesActions.jsx';

import Drawer from 'material-ui/Drawer';

import File from './tree/File.jsx';
import Directory from './tree/Directory.jsx';
import FileToolBar from './tree/FileToolBar.jsx';
import NewNode from './tree/NewNode.jsx';


class DirectoryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: null
        }
    }

    onFileSelect(path, type) {
        this.props.selectFile(path, type);
        if (type === 'F') {
            this.props.openFile(path);
        } 

    }


    createNode(fileName) {
        if (!fileName) {
            this.state.tooltip = null;
            return this.props.terminateFileAdd();
        }
        var path = (this.props.selected.path || '') + '/' + fileName;
        if (this.props.tree[path]) {
            this.setState({tooltip: 'File already exists'})
        } else {
            this.state.tooltip = null;
            this.props.addFile(path);
        }
    }


    stopPropagation(e) {
        e.stopPropagation();
    }

    render() {
        const style = {backgroundColor: 'rgba(0, 188, 212, 0.2)'}

        const treeCreate = (path) => {
            var node = this.props.tree[path];
            return node.node_type === 'F' ?
                <File key={node.path} 
                    file={node} 
                    style={node.path === this.props.selected.path ? style : undefined}
                    onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}/>
                : <Directory key={node.path} 
                    file={node} 
                    open={node.open}
                    style={node.path === this.props.selected.path ? style : undefined}
                    onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}>
                        
                        {node.children && node.children.map(treeCreate)}
                        {this.props.newFile.type && this.props.selected.path === node.path ?
                            <NewNode onEnter={this.createNode.bind(this)} type={this.props.newFile.type} tooltip={this.state.tooltip} />
                            : null
                        }
                </Directory>
        }

        return <div onClick={() => this.props.selectFile()}>
            <Drawer open={this.props.open} openSecondary={true} width={300}>
                <FileToolBar selected={this.props.selected} 
                             disableTrash={!!this.props.newFile.type}
                             onClose={this.props.onClose}
                             onClick={this.stopPropagation}
                             onAddNode={this.props.startFileAdd}
                             onDelete={this.props.deleteFile}
                             />
                <div className="tree" onClick={this.stopPropagation}>
                    {Object.keys(this.props.tree)
                    .reduce((accum, path) => path.split('/').length === 2  ? accum.concat(path) : accum, [])
                    .map(treeCreate)}
                    {this.props.newFile.type && !this.props.selected.path ?
                        <NewNode onEnter={this.createNode.bind(this)} type={this.props.newFile.type} tooltip={this.state.tooltip} />
                        : null
                    }
                </div>
                
            </Drawer>
        </div>
    }
}

const mapStateToProps = (state) => {
  return {
    tree: state.directoryTree.tree,
    selected: state.directoryTree.selected,
    newFile: state.directoryTree.newFile,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openFile: (path) => {
            dispatch(openFile(path))
        },
        addFile: (path) => {
            dispatch(addFile(path))
        },
        startFileAdd: (type) => {
            dispatch(startFileAdd(type))
        },
        terminateFileAdd: () => {
            dispatch(terminateFileAdd());
        },
        deleteFile: () => {
            dispatch(deleteFile())
        },
        selectFile: (path, type) => {
            dispatch(selectFile(path, type))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryTree);