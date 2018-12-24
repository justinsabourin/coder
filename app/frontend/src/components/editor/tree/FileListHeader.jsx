import React from "react";
import { withStyles, Typography } from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  root: {
    padding: 0,
    margin: 0,
    marginTop: -11,
    transform: "translate(0, 11px)",
    display: "flex",
    flexDirection: "row",
    position: "relative"
  }
});

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  default: "flex-end"
};

class FileListHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, className, align, children } = this.props;
    return (
      <div
        style={{ justifyContent: align ? alignMap[align] : alignMap.default }}
        className={classNames(classes.root, className)}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(FileListHeader);
