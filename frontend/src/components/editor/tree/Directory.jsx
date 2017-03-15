import React from 'react';

class Directory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    onSelect(e) {
        this.setState({open: !this.state.open})
        this.props.onSelect(e);
    }

    render() {
        this.state.open = this.props.open || this.state.open;
        const style = {...this.props.style, marginTop: '1px', padding: '2px 0 2px 1px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap'}
        return <div> 
            <div style={style} onClick={this.onSelect.bind(this)}>
                <span className={"fa " + (this.state.open ? "fa-folder-open" : "fa-folder")}></span>
                <span style={{padding: '9px 0 9px 8px'}}>{this.props.file.name}</span>
            </div>
            {this.state.open && 
                <div style={{marginLeft: '15px'}}>
                    {this.props.children}
                </div>
            }
        </div>
    }
}

export default Directory;