import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

import { Button } from "@material-ui/core";

const styles = theme => ({
  root: {
    margin: "0 9px",
    backgroundColor: theme.palette.primary.light,
    padding: "0 3px"
  },
  xs: {
    minWidth: 7,
    minHeight: 10,
    fontSize: 9,
    padding: 2.5
  }
});

class FileListButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, children, onClick, color, style, size } = this.props;
    return (
      <div style={style} className={classes.root}>
        <Button
          className={classNames({
            [classes.xs]: size === "xs"
          })}
          onClick={onClick}
          size="small"
          variant="contained"
          color={color}
        >
          {children}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(FileListButton);
