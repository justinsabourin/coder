import React from 'react';
 

class File extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {

        return <div style={this.props.style} className="node" onClick={this.props.onSelect}>
            <span className="fa fa-file"></span>
            <span className="node-text">{this.props.file.name}</span>
        </div>
    }
}

export default File;