import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

const footerStyles = theme => ({
  root: {
    padding: 0,
    margin: 0,
    marginBottom: -15,
    transform: "translate(0, -15px)",
    display: "flex",
    flexDirection: "row",
    position: "relative",
    flex: "none",
    alignItems: "center"
  }
});

const headerStyles = theme => ({
  root: {
    padding: 0,
    margin: 0,
    marginTop: -11,
    transform: "translate(0, 11px)",
    display: "flex",
    flexDirection: "row",
    position: "relative",
    flex: "none",
    alignItems: "center"
  }
});

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  default: "flex-end"
};

class FileListSection extends React.Component {
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

export let FileListFooter = withStyles(footerStyles)(FileListSection);
export let FileListHeader = withStyles(headerStyles)(FileListSection);
