import React from "react";
import { withStyles } from "@material-ui/core";

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

class Directory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes } = this.props;
    const style = { ...this.props.style, whiteSpace: "nowrap" };
    return (
      <div>
        <div
          style={style}
          className={classes.node}
          onClick={this.props.onSelect}
        >
          <span
            className={
              "fa " + (this.props.open ? "fa-folder-open" : "fa-folder")
            }
          />
          <span className={classes.nodeText}>{this.props.file.name}</span>
        </div>
        {this.props.open && (
          <div style={{ marginLeft: "15px" }}>{this.props.children}</div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Directory);
