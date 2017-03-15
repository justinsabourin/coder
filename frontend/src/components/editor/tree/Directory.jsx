import React from 'react';

class Directory extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const style = {...this.props.style, whiteSpace: 'nowrap'}
        return <div> 
            <div style={style} className="node" onClick={this.props.onSelect}>
                <span className={"fa " + (this.props.open ? "fa-folder-open" : "fa-folder")}></span>
                <span className="node-text">{this.props.file.name}</span>
            </div>
            {this.props.open && 
                <div style={{marginLeft: '15px'}}>
                    {this.props.children}
                </div>
            }
        </div>
    }
}

export default Directory;