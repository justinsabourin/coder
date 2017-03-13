import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import File from './tree/File.jsx';


const DirectoryTree = (props) => {
    return <Drawer open={props.open} openSecondary={true} width={300}>
        <AppBar iconElementLeft={<IconButton iconClassName="fa fa-times" iconStyle={{color: 'white'}} />}
            onLeftIconButtonTouchTap={props.onClose}>
            <IconButton style={{marginTop: '8px'}} iconClassName="fa fa-file" iconStyle={{color: 'white'}} />
            <IconButton style={{marginTop: '8px'}} iconClassName="fa fa-folder" iconStyle={{color: 'white'}} />
            <IconButton style={{marginTop: '8px'}} iconClassName="fa fa-trash" iconStyle={{color: 'white'}} />
        </AppBar>
        <div style={{marginLeft: 5, marginTop: 10}}>
            <File />
            <File />
            <File />
            <File />
        </div>
        
    </Drawer>
}

export default DirectoryTree;