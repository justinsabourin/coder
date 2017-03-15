import React from 'react';
 

class File extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        const style = {...this.props.style, marginTop: '1px', padding: '2px 0 2px 1px', borderRadius: '4px', cursor: 'pointer'}
        return <div style={style} onClick={this.props.onSelect}>
            <span className="fa fa-file"></span>
            <span style={{padding: '9px 0 9px 8px'}}>{this.props.file.name}</span>
        </div>
    }
}

export default File;