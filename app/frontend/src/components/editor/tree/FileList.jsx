import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  pad: {
    padding: "15px 0",
    flex: 1,
    border: `2px solid ${theme.palette.primary.dark}`,
    borderRadius: 2,
    display: "flex"
  },
  root: {
    padding: "8px 5px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily,
    width: "100%"
  }
});

class FileList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, className, onClick, children } = this.props;
    return (
      <div className={classes.pad}>
        <div onClick={onClick} className={classNames(classes.root, className)}>
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FileList);
