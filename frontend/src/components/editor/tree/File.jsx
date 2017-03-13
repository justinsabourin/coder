import React from 'react';
 

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style : {
                width: '100%', 
                height: 20,
                cursor: 'pointer'
            }
        }
    }

    handleClick() {
        this.setState({style: {...this.state.style, backgroundColor: 'rgba(0, 188, 212, 0.3)'}})
    }


    render() {
        return <div style={this.state.style} onClick={this.handleClick.bind(this)}>
            <span className="fa fa-file"></span>
            <span style={{marginTop: '10px', padding: '9px 0 9px 8px'}}>index.html</span>
        </div>
    }
}

export default File;