import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IconButton from 'material-ui/IconButton';

import 'brace/mode/javascript';
import 'brace/theme/dreamweaver';
import 'brace/ext/language_tools';



const Editor = (props) => {
    return <div style={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
        <Tabs >
            <TabList  style={{backgroundColor: 'rgb(0, 188, 212)', marginBottom: 0, width: '100%', overflowX: 'auto', whiteSpace: 'nowrap', overflowY: 'hidden'}}>
            
            {props.files.open.map((file, i) => {
                if (i === props.files.active) {
                    return <Tab key={i} style={{fontFamily: 'Roboto', color: 'white', backgroundColor: 'rgb(0, 188, 212)', borderColor: 'white', borderWidth: '2px', borderRadius: '5px 5px 0 0'}}>
                        {file.name}
                        <IconButton style={{width: '20px', height: '20px', padding: '2px', margin: '0px', marginLeft: '15px'}} iconStyle={{color: 'white', fontSize: '18px'}} iconClassName="fa fa-times"></IconButton>
                    </Tab>;
                }
                return <Tab key={i} style={{fontFamily: 'Roboto', color: 'white', backgroundColor: 'rgb(0, 188, 212)', borderColor: 'rgb(0, 188, 212)'}}>{file.name}</Tab>;
            })}
            
            </TabList>
            {props.files.open.map((a, i) => <TabPanel key={i}></TabPanel>)}
        </Tabs>
        <AceEditor
                mode="javascript"
                theme="dreamweaver"
                name="EDITOR"
                width="100%"
               // editorProps={{$blockScrolling: true}}
                wrapEnabled={true}
                style={{flex: 1}}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    tabSize: 2,
                    fontSize: 16,
                }}
            />
    </div>;
}

export default Editor;