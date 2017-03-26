import React from 'react';
import { connect } from 'react-redux';

import { toggleGitStatus, commitFiles } from '../../actions/gitActions.jsx';

import Commit from './git/Commit.jsx';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';


class Git extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return <Drawer open={this.props.open}  width={500} containerStyle={{ height: '70%', top: '30%', overflow: 'hidden' }}>
                <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <AppBar iconElementRight={<IconButton iconClassName="fa fa-times" iconStyle={{color: 'white'}} />}
                        showMenuIconButton={false}
                        style={{height: 48}}
                        titleStyle={{height: 48}}
                        iconStyleRight={{marginTop: 0}}
                        onRightIconButtonTouchTap={this.props.onClose}
                        title={<Tabs style={{width: 200}}>
                            <Tab
                            icon={<FontIcon className="fa fa-git" />}
                            />
                            <Tab
                            icon={<FontIcon className="fa fa-github" />}
                            />
                        </Tabs>}>
                        
                    </AppBar>
                    
                  <Commit status={this.props.status} onCommit={this.props.commitFiles} onSelect={this.props.toggleGitStatus} style={{flex: 1, display: 'flex', flexDirection: 'column'}} />
                </div>
            </Drawer>
        
    }
}

const mapStateToProps = (state) => {
  return {
    status: Object.values(state.git.status)
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleGitStatus: (path) => {
            dispatch(toggleGitStatus(path))
        },
        commitFiles: (message) => {
            dispatch(commitFiles(message))
        }
    };
}




export default connect(mapStateToProps, mapDispatchToProps)(Git);