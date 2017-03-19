import React from 'react';

const Tab = (props) => {
    var classes = props.className ? "tab " + props.className : "tab";
    return <div className={classes} onClick={props.onClick}>
        {props.children}
    </div>
}

export default Tab;