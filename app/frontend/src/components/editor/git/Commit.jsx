import React from 'react';


import Chip from 'material-ui/Chip';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';



const chipStyle = {
    'NEW': {
        color: '#0a9900',
    },
    'MODIFIED': {
        color: '#027bd8',
    },
    'CONFLICTED': {
        color: '#ccad02',
    },
    'DELETED': {
        color: '#e21d1d',
    },
    'RENAMED' : {}
}

const chipColor = {
    'NEW': 'rgba(139, 206, 134, 0.7)',
    'MODIFIED': 'rgba(132, 196, 214, 0.7)',
    'CONFLICTED': 'rgba(255, 250, 117, 0.7)',
    'DELETED': 'rgba(237, 113, 113, 0.7)',
    'RENAMED': ''
}

const rowColor = {
    'NEW': 'rgba(191, 232, 187, 0.7)',
    'MODIFIED': 'rgba(179, 210, 219, 0.7)',
    'CONFLICTED': 'rgba(247, 246, 187, 0.7)',
    'DELETED': 'rgba(252, 171, 171, 0.7)',
    'RENAMED': ''
}


class Commit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            tooltip: ""
        }
    }

    onRowSelection(rows) {
        if (rows === 'all' || rows === 'none') return this.props.onSelect(rows);
        this.props.onSelect(rows.reduce((accum, row) => {
            accum[this.props.status[row].path] = true;
            return accum;
        }, {}));
        
    }

    onCommit() {
        if (this.state.message.length === 0) {
            return this.setState({tooltip: 'Commit message cannot be empty'});
        }
        this.props.onCommit(this.state.message);
        this.setState({tooltip: "", message: ""});

    }



    render() {

        const disableCommit = !this.props.status.reduce((accum, stat) => accum || stat.selected, false);

        return <div style={this.props.style}>
            <Paper style={{width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}} zDepth={2}> 
                <RaisedButton onClick={this.onCommit.bind(this)} disabled={disableCommit} style={{margin: 10}} label="Commit" primary={true}/>
                <TextField
                    onChange={(e) => this.setState({message: e.target.value})}
                    value={this.state.message}
                    style={{flex: 1, marginTop: 5, marginRight: 15}}
                    textareaStyle={{overflow: 'hidden'}}
                    maxLength={100}
                    hintText="Commit Message"
                    multiLine={true}
                    rows={1}
                    rowsMax={4}
                    errorText={this.state.tooltip}
                    disabled={disableCommit}
                    />
            </Paper>
            <Divider />
            <div style={{flex: 1, display: 'flex', overflow: 'auto'}}>
                <Table
                    style={{flex: 1}}
                    multiSelectable={true}
                    onRowSelection={this.onRowSelection.bind(this)}
                    >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={{paddingLeft: 0}} tooltip="File Path">File Path</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '80px'}} tooltip="Modification Type">Type</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        deselectOnClickaway={false}
                    >
                        {this.props.status.map((row, index) => (
                        <TableRow style={{height: 30, backgroundColor: rowColor[row.type]}} key={index} selected={false}>
                            <TableRowColumn style={{fontWeight: 500, paddingLeft: 0}}>
                                {row.type === 'MODIFIED' ? 
                                    (row.path.length <= 42 ? row.path : row.path.slice(0,20) + '...' + row.path.slice(-19))
                                    : (row.path.length <= 46 ? row.path : row.path.slice(0,22) + '...' + row.path.slice(-21) )}
                                
                                {row.type === 'MODIFIED' &&
                                <FlatButton onClick={e => e.stopPropagation()} backgroundColor="#edeeef" labelStyle={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: '#e89043'}} style={{lineHeight: 'normal', minWidth: 30, height: 20, marginLeft: 6}} label="DIFF" />}
                            </TableRowColumn>
                            <TableRowColumn style={{height: 30, paddingLeft: 0, marginLeft: 24,  width: '80px'}}>
                                <Chip backgroundColor={chipColor[row.type]} labelStyle={{...chipStyle[row.type],fontSize: 11, lineHeight: '25px', paddingLeft: 8, paddingRight: 8}}>
                                    {row.type}
                                </Chip>
                            </TableRowColumn> 
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
               
            </div>
            {this.props.status.length === 0 && <h2 style={{marginTop: 10, textAlign: 'center', fontFamily: 'Indie Flower'}}>No changes yet!</h2>}
        </div>
    }
}

export default Commit;