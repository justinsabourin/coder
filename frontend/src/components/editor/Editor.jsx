import React from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';

import { closeTab, switchTab, updateFileContents } from '../../actions/filesActions.jsx';

import Tabs from './tabs/Tabs.jsx';
import Tab from './tabs/Tab.jsx';

import IconButton from 'material-ui/IconButton';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/dreamweaver';
import 'brace/ext/language_tools';


const Editor = (props) => {
    if (props.openFiles.length === 0) return <div></div>


    var fileType = props.activeFile.file_type;

    return <div className="editor-container">
        <Tabs >     
            {props.openFiles.map((file, i) => {
                var className = i === props.activeFile.tabNumber ? "tab-active" : undefined;
                var onClick = i !== props.activeFile.tabNumber ? props.switchTab.bind(null, i) : undefined;
                return <Tab key={i} className={className} onClick={onClick}>
                        <span className="tab-text">{file.name + (file.dirty ? ' *' : '')}</span>
                        <IconButton onClick={(e) => {e.stopPropagation(); props.closeTab(i)}} className="close-tab" style={{width: 20, height:20, padding: 0, marginLeft: 5}} iconStyle={{color: 'inherit', fontSize: '18px', transition: 'none'}} iconClassName="fa fa-times"></IconButton>
                    </Tab>;
            })}
        </Tabs>
        <AceEditor
                mode={fileType}
                theme="dreamweaver"
                name="EDITOR"
                width="100%"
                editorProps={{$blockScrolling: true}}
                value={props.activeFile.contents}
                onChange={(e) => props.updateFileContents(e)}
                wrapEnabled={true}
                style={{flex: 1}}
                setOptions={{
                    enableBasicAutocompletion: true,
                  //  enableLiveAutocompletion: true,
                    tabSize: 2,
                    fontSize: 16,
                }}
            />
    </div>;
}


const mapStateToProps = (state) => {
  return {
    openFiles: state.files.open,
    activeFile: {
        ...state.files.open[state.files.active],
        tabNumber: state.files.active
    }
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        switchTab: (newTab) => {
            dispatch(switchTab(newTab))
        },
        closeTab: (tab) => {
            dispatch(closeTab(tab))
        },
        updateFileContents: (contents) => {
            dispatch(updateFileContents(contents));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);