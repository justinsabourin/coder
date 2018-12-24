import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { getProject } from "../../actions/projectActions.jsx";
import {
  saveFile,
  viewProjectNewTab,
  viewProjectinEditor
} from "../../actions/filesActions.jsx";
import { toggleDirectoryView } from "../../actions/directoryTreeActions.jsx";
import { toggleGitView } from "../../actions/gitActions.jsx";

import Loader from "../shared/Loader.jsx";
import DirectoryTree from "./DirectoryTree.jsx";
import Git from "./Git.jsx";
import Editor from "./Editor.jsx";
import Logo from "../shared/Logo.jsx";
import {
  Toolbar,
  withStyles,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemIcon
} from "@material-ui/core";
import history from "../../history";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.dark
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: 0,
    marginLeft: theme.spacing.unit * 5 + 1
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: theme.drawer.width
  },
  drawer: {
    width: theme.spacing.unit * 5 + 1,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: theme.spacing.unit * 5 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 5 + 1
    }
  },
  list: {
    padding: 0
  },
  listItem: {
    paddingLeft: 10,
    color: theme.palette.primary.contrastText
  },
  icon: {
    color: theme.palette.primary.contrastText,
    overflow: "visible"
  },
  git: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: theme.spacing.unit * 5 + 1,
    marginRight: 0
  },
  gitShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: theme.drawer.width
  }
});

class Project extends React.Component {
  constructor(props) {
    super(props);
    props.getProject(props.match.params.project);
  }

  render() {
    if (this.props.isLoading) return <Loader />;
    let { classes } = this.props;

    const iconStyles = { color: "white", marginTop: 8 };
    const iconPush = { margin: "0 280px 0 0" };

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, classes.drawerPaper)}
          classes={{ paper: classes.drawerPaper }}
          open
        >
          <List classes={{ padding: classes.list }}>
            <ListItem
              button
              classes={{ gutters: classes.listItem }}
              onClick={this.props.toggleDirectoryView}
            >
              <ListItemIcon>
                <Icon
                  className={classNames("fa fa-lg fa-folder", classes.icon)}
                />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              classes={{ gutters: classes.listItem }}
              onClick={this.props.toggleGitView}
            >
              <ListItemIcon>
                <Icon className={classNames("fa fa-lg fa-git", classes.icon)} />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              classes={{ gutters: classes.listItem }}
              onClick={this.props.viewProjectinEditor}
            >
              <ListItemIcon>
                <Icon className={classNames("fa fa-lg fa-eye", classes.icon)} />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              classes={{ gutters: classes.listItem }}
              onClick={this.props.viewProjectNewTab}
            >
              <ListItemIcon>
                <Icon
                  className={classNames(
                    "fa fa-lg fa-external-link",
                    classes.icon
                  )}
                />
              </ListItemIcon>
            </ListItem>
          </List>
          <List
            style={{ marginTop: "auto" }}
            classes={{ padding: classes.list }}
          >
            <ListItem
              button
              classes={{ gutters: classes.listItem }}
              onClick={() => history.push("/")}
            >
              <ListItemIcon>
                <Icon
                  className={classNames(
                    "fa fa-lg fa-arrow-circle-left",
                    classes.icon
                  )}
                />
              </ListItemIcon>
            </ListItem>
          </List>
        </Drawer>

        <DirectoryTree
          open={this.props.directoryViewOpen}
          onClose={this.props.toggleDirectoryView}
        />
        <div
          className={classNames(classes.root, classes.content, {
            [classes.contentShift]: this.props.directoryViewOpen
          })}
        >
          <Editor />
          <Git
            classNames={{
              gitPaper: classNames(classes.git, {
                [classes.gitShift]: this.props.directoryViewOpen
              })
            }}
            open={this.props.gitViewOpen}
            onClose={this.props.toggleGitView}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    metadata: state.project.metadata,
    isLoading: state.project.loading,
    canSave:
      state.files.open.length > 0 && state.files.open[state.files.active].dirty,
    directoryViewOpen: state.directoryTree.open,
    gitViewOpen: state.git.open
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProject: name => {
      dispatch(getProject(name));
    },
    saveFile: () => {
      dispatch(saveFile());
    },
    viewProjectNewTab: () => {
      dispatch(viewProjectNewTab());
    },
    viewProjectinEditor: () => {
      dispatch(viewProjectinEditor());
    },
    toggleDirectoryView: () => {
      dispatch(toggleDirectoryView());
    },
    toggleGitView: () => {
      dispatch(toggleGitView());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Project));
