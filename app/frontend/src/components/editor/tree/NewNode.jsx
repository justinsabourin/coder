import React from 'react';
import TextField from 'material-ui/TextField'

class NewNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: null
        }

    }

    handleEnter(e) {
        if(e.key !== 'Enter') return;
        if (!this.value) {
            this.props.onEnter(null);
            return;
        }
        var match;
        if (this.props.type === 'F') {
            match = this.value.match(/^[a-zA-Z0-9]+.(html|js|css)$/g)
            if (match) {
                this.props.onEnter(this.value);
            } else {
                this.setState({tooltip: 'Files must be of the form [name].[ html | js | css] '})
            }
        } else if (this.props.type === 'D') {
            match = this.value.match(/^[a-zA-Z0-9]+$/i)
            if (match) {
                this.props.onEnter(this.value);
            } else {
                this.setState({tooltip: 'Folders must contain only alphanumberic characters'})
            }
        }
        
    }

    render() {
        const style = {marginTop: '3px', padding: '2px 0 2px 1px', fontSize: 15, height: 26 }
        var hintText = this.props.type === 'F' ? 'File name' : 'Folder name';
        var tooltip = this.state.tooltip || this.props.tooltip;
        return <TextField onChange={(e) => this.value = e.target.value} 
                      style={style}
                      fullWidth={true}
                      autoFocus
                      inputStyle={{bottom: 6}}
                      hintStyle={{bottom: 10}}
                      hintText={hintText}
                      errorText={tooltip}
                      onKeyPress={this.handleEnter.bind(this)}/>
    }

}


export default NewNode;

