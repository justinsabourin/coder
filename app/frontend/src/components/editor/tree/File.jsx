import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  node: {
    marginTop: 1,
    padding: "2px 0 2px 1px",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    flex: "none",
    alignItems: "baseline"
  },
  nodeText: {
    padding: "0 0 0 8px",
    display: "flex",
    flex: 1
  }
});

class File extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, style, onSelect, className, children } = this.props;
    return (
      <div
        style={style}
        className={classNames(classes.node, className)}
        onClick={onSelect}
      >
        <span className="fa fa-file" />
        <span className={classes.nodeText}>{children}</span>
      </div>
    );
  }
}

export default withStyles(styles)(File);
