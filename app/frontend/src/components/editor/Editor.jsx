import React from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';

import { saveFile, closeTab, switchTab, updateFileContents, viewProjectinEditor } from '../../actions/filesActions.jsx';
import { toggleDirectoryView } from '../../actions/directoryTreeActions.jsx'

import Tabs from './tabs/Tabs.jsx';
import Tab from './tabs/Tab.jsx';

import IconButton from 'material-ui/IconButton';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/dreamweaver';
import 'brace/ext/language_tools';


class Editor extends React.Component { 
    constructor(props) {
        super(props);
        this.commands = [{
            name: 'Save',
            bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
            exec: this.handleSave.bind(this),
        },{
            name: 'Preview',
            bindKey: {win: 'Ctrl-P', mac: 'Cmd-P'},
            exec: this.props.viewProjectinEditor
        },{
            name: 'Toggle Tree View',
            bindKey: {win: 'Ctrl-\\', mac: 'Cmd-\\'},
            exec: this.props.toggleDirectoryView
        },{
            name: 'Undo',
            bindKey: {win: 'Ctrl-Z', mac: 'Cmd-Z'},
            exec: () => {/* prevent undo */}
        }];
    }

    handleSave(editor) {
        if (!this.props.activeFile.dirty) return;
        this.props.saveFile();
    }
    
    render() {
        const { openFiles, activeFile, updateFileContents, switchTab, closeTab } = this.props;

        var view;
        var style = {flex: 1, display: 'none'}
        switch(activeFile.node_type) {
            case 'F':
                view = null;
                style.display = 'block';
                break;
            case 'IFR':
                style.display = 'none';
                view = <iframe style={{flex: 1}} src={activeFile.path} frameBorder="0"></iframe>
                break;
        }


        return <div className="editor-container">
            <Tabs >     
                {openFiles.map((file, i) => {
                    var className = i === activeFile.tabNumber ? "tab-active" : undefined;
                    var onClick = i !== activeFile.tabNumber ? switchTab.bind(null, i) : undefined;
                    return <Tab key={i} className={className} onClick={onClick}>
                            <span className="tab-text">{file.name + (file.dirty ? ' *' : '')}</span>
                            <IconButton onClick={(e) => {e.stopPropagation(); closeTab(i)}} className="close-tab" style={{width: 20, height:20, padding: 0, marginLeft: 5}} iconStyle={{color: 'inherit', fontSize: '18px', transition: 'none'}} iconClassName="fa fa-times"></IconButton>
                        </Tab>;
                })}
            </Tabs>
            {view}
            <AceEditor
                    mode={activeFile.file_type || "html"}
                    theme="dreamweaver"
                    name="EDITOR"
                    width="100%"
                    editorProps={{$blockScrolling: Infinity}}
                    value={activeFile.contents}
                    onChange={updateFileContents}
                    wrapEnabled={true}
                    style={style}
                    commands={this.commands}
                    setOptions={{
                        enableBasicAutocompletion: true,
                    //  enableLiveAutocompletion: true,
                        tabSize: 2,
                        fontSize: 16,
                    }}
                   // markers={[{ startRow: 0, endRow: 1, className: 'error-marker', type: 'background' }]}
                />
        </div>;
    }
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
        },
        saveFile: () => {
            dispatch(saveFile());
        },
        viewProjectinEditor: () => {
            dispatch(viewProjectinEditor());
        },
        toggleDirectoryView: () => {
            dispatch(toggleDirectoryView())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);