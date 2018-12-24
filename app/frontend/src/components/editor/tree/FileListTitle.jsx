import React from "react";
import { withStyles, Typography } from "@material-ui/core";

const styles = theme => ({
  typo: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "-webkit-text-stroke": `0.3px ${theme.palette.primary.dark}`,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 2px",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    fontSize: 16,
    textTransform: "uppercase"
  }
});

class FileListTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, children } = this.props;
    return <span className={classes.typo}>{children}</span>;
  }
}

export default withStyles(styles)(FileListTitle);
