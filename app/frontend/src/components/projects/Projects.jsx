import React from "react";
import { connect } from "react-redux";

import { getProjects, createProject } from "../../actions/projectsActions.jsx";
import { userLogout } from "../../actions/userActions.jsx";
import { toggleCreate } from "../../actions/uiActions.jsx";

import ProjectList from "./ProjectList.jsx";
import Loader from "../shared/Loader.jsx";
import Logo from "../shared/Logo.jsx";

import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/More";

const styles = theme => ({
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  content: {
    width: "80%",
    margin: "auto",
    marginTop: 20
  }
});

class Projects extends React.Component {
  constructor(props) {
    super(props);
    props.getProjects();
    this.createProject = this.createProject.bind(this);
  }

  handleClose() {
    this.setState({ projectName: "", projectNameError: null });
    this.props.toggleCreate();
  }

  createProject(projectName) {
    if (projectName.length < 2 || projectName.length > 15) {
      return "Project name must be between 2 and 15 characters";
    } else if (!/^[0-9a-zA-Z]+$/.test(projectName)) {
      return "Project name must be alphanumeric";
    } else {
      this.props.createProject(projectName);
    }
  }

  render() {
    let { classes } = this.props;

    let projectsDisplay;
    if (this.props.isLoading) {
      projectsDisplay = <Loader />;
    } else if (this.props.projects.length === 0) {
      var message = this.props.errorMessage || "No Projects";
      projectsDisplay = <h3 className="empty-projects-message">{message}</h3>;
    } else {
      projectsDisplay = (
        <ProjectList
          projects={this.props.projects}
          onCreate={this.createProject}
          createError={this.props.ui.createError}
        />
      );
    }
    return (
      <div>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Logo />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              {/* <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>{projectsDisplay}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projects.list,
    isLoading: state.projects.loading,
    errorMessage: state.projects.error,
    ui: state.ui.projects
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjects: () => {
      dispatch(getProjects());
    },
    createProject: project => {
      dispatch(createProject(project));
    },
    logOut: () => {
      dispatch(userLogout());
    },
    toggleCreate: () => {
      dispatch(toggleCreate());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Projects));
