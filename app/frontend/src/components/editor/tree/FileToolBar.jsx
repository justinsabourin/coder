import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';


class FileToolBar extends React.Component {
    constructor(props) {
        super(props);
    }

    generateAddNode(type) {
        return () => this.props.onAddNode(type);
    }

    render() {
        var selected = this.props.selected;
        var fileName = selected.path && selected.path.split('/').slice(-1)[0];
        var addDisabled = selected.type === 'F';
        var deleteDisabled = this.props.disableTrash || !selected.path || selected.path === '/index.html';
        return <AppBar style={{overflow: 'visible'}} onClick={this.props.onClick} iconElementLeft={<IconButton iconClassName="fa fa-times" iconStyle={{color: 'white'}} />}
                onLeftIconButtonTouchTap={this.props.onClose}>
                <IconButton onClick={this.generateAddNode('F')} disabled={addDisabled} style={{marginTop: '8px'}} iconClassName="fa fa-file" iconStyle={{color: addDisabled ? 'gray' :' white'}} tooltip="Create File" />
                <IconButton onClick={this.generateAddNode('D')} disabled={addDisabled} style={{marginTop: '8px'}} iconClassName="fa fa-folder" iconStyle={{color: addDisabled ? 'gray' : 'white'}} tooltip="Create Folder" />
                <IconButton onClick={this.props.onDelete} disabled={deleteDisabled} style={{marginTop: '8px'}} iconClassName="fa fa-trash" iconStyle={{color: deleteDisabled ? 'gray' : 'white'}} tooltip={"Delete " + fileName}/>
            </AppBar>
    }
}

export default FileToolBar;