import React from "react";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  tab: {
    fontFamily: "Roboto",
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.light,
    borderColor: "rgb(0, 188, 212)",
    padding: "7px 5px",
    margin: "0 1px",
    cursor: "pointer"
  }
});

const Tab = ({ classes, className, onClick, children }) => {
  let classNames = className ? classes.tab + " " + className : classes.tab;
  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Tab);
