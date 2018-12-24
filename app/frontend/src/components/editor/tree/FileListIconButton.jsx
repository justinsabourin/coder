import React from "react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

import { Tooltip, Icon, IconButton } from "@material-ui/core";

const styles = theme => ({
  button: {
    padding: "0 1px",
    margin: "0 9px",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark
    },
    "&:disabled": {
      color: "gray"
    }
  },
  icon: {
    fontSize: 22
  }
});

class FileListIconButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes, className, children, onClick, disabled } = this.props;
    return (
      <Tooltip title={children}>
        <IconButton
          disabled={disabled}
          className={classes.button}
          onClick={onClick}
        >
          <Icon className={classNames(className, classes.icon)} />
        </IconButton>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(FileListIconButton);
