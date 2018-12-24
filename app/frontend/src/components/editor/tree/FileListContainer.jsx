import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  }
});

class FileListContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, className, onClick, style, children } = this.props;
    return (
      <div
        style={style}
        onClick={onClick}
        className={classNames(classes.root, className)}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(FileListContainer);
