import React from "react";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  tabList: {
    width: "100%",
    display: "flex",
    overflowX: "auto",
    backgroundColor: theme.palette.primary.dark,
    padding: 0,
    margin: 0,
    "&::-webkit-scrollbar": {
      display: "none"
    }
  }
});

const Tabs = ({ children, classes }) => {
  return <div className={classes.tabList}>{children}</div>;
};

export default withStyles(styles)(Tabs);
