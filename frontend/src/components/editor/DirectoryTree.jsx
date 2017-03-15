import React from 'react';
import Drawer from 'material-ui/Drawer';
import File from './tree/File.jsx';
import Directory from './tree/Directory.jsx';
import FileToolBar from './tree/FileToolBar.jsx';
import NewNode from './tree/NewNode.jsx';


class DirectoryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            addingFile: {}
        }

    }

    onFileSelect(path, type, e) {
        this.setState({selected: {path, type}, addingFile: {}});
        if (type === 'F') {
            this.props.openFile(path);
        }

    }

    onAddNode(type) {
        this.setState({addingFile: {type} });
    }

    onCreateNode(value) {
        if (!value) {
            this.setState({addingFile: {}});
            return;
        }
        var path = (this.state.selected.path || '') + '/' + value;
        if (this.props.tree[path]) {
            this.setState({addingFile: {...this.state.addingFile, tooltip: 'File already exists'}})
        } else {
            this.props.addFile(path, this.state.addingFile.type);
            this.setState({selected: {}, addingFile: {}});
        }
    }

    onDeleteNode() {
        this.props.deleteFile(this.state.selected.path);
        this.state.selected = {};
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
                    style={node.path === this.state.selected.path && style}
                    onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}/>
                : <Directory key={node.path} 
                    file={node} 
                    open={this.state.addingFile.type && this.state.selected.path === node.path}
                    style={node.path === this.state.selected.path && style}
                    onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}>
                        
                        {Object.values(node.children).map(treeCreate)}
                        {this.state.addingFile.type && this.state.selected.path === node.path ?
                            <NewNode onEnter={this.onCreateNode.bind(this)} type={this.state.addingFile.type} tooltip={this.state.addingFile.tooltip} />
                            : null
                        }
                </Directory>
        }

        return <div onClick={() => this.setState({selected: {}, addingFile: {}})}>
            <Drawer open={this.props.open} openSecondary={true} width={300}>
                <FileToolBar selected={this.state.selected} 
                             disableTrash={!!this.state.addingFile.type}
                             onClose={this.props.onClose}
                             onClick={this.stopPropagation}
                             onAddNode={this.onAddNode.bind(this)}
                             onDelete={this.onDeleteNode.bind(this)}
                             />
                <div style={{marginLeft: 5, marginTop: 10}} onClick={this.stopPropagation}>
                    {Object.values(this.props.tree)
                    .reduce((accum, node) => node.path.split('/').length === 2  ? accum.concat(node.path) : accum, [])
                    .map(treeCreate)}
                    {this.state.addingFile.type && !this.state.selected.path ?
                        <NewNode onEnter={this.onCreateNode.bind(this)} type={this.state.addingFile.type} tooltip={this.state.addingFile.tooltip} />
                        : null
                    }
                </div>
                
            </Drawer>
        </div>
    }
}

export default DirectoryTree;