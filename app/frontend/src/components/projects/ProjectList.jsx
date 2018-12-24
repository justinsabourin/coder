import React from "react";
import history from "../../history";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
  root: {
    width: "100%"
  },
  projects: {
    flexWrap: "wrap",
    overflow: "hidden",
    padding: 10
  },
  panel: {
    display: "flex",
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 3,
    justifyContent: "space-around",
    width: "100%",
    margin: "15px 0",
    position: "relative"
  },
  gridList: {
    width: "100%",
    height: 450,
    justifyContent: "space-around"
  },
  tile: {
    border: `5px solid ${theme.palette.primary.light}`,
    borderRadius: 5,
    padding: 0,
    width: "30%"
  },
  icon: {
    color: theme.palette.primary.contrastText
  },
  header: {
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: theme.palette.primary.dark,
    "-webkit-text-stroke": `1px ${theme.palette.secondary.main}`,
    fontWeight: 500
  },
  margin: {
    margin: "auto",
    marginBottom: 10
  }
});

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      hovering: null,
      projectName: "",
      projectNameErr: null
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createProject = this.createProject.bind(this);
  }

  onEnter(index) {
    this.setState({
      hovering: index
    });
  }

  handleClickOpen() {
    this.setState({ openDialog: true });
  }

  handleClose() {
    this.setState({ openDialog: false, projectName: "", projectNameErr: null });
  }

  createProject() {
    let err = this.props.onCreate(this.state.projectName);
    if (!err) {
      this.handleClose();
    } else {
      this.setState({ projectNameErr: err });
    }
  }

  render() {
    let { classes, projects } = this.props;
    return (
      <div className={classes.root}>
        <div className={classNames(classes.panel, classes.header)}>
          <Typography
            className={classes.headerText}
            align="center"
            component="h4"
            variant="h4"
          >
            Projects
          </Typography>
          <Fab
            color="secondary"
            size="small"
            aria-label="Add"
            onClick={this.handleClickOpen}
            style={{ right: 10, position: "absolute" }}
          >
            <AddIcon />
          </Fab>
        </div>

        <div className={classNames(classes.panel, classes.projects)}>
          <GridList cellHeight={150} cols={3} className={classes.gridList}>
            {projects.map((project, index) => (
              <GridListTile
                className={classes.tile}
                style={{ padding: 0, width: "32%" }}
                key={project.project_name}
                onMouseEnter={this.onEnter.bind(this, index)}
                onMouseLeave={() => this.setState({ hovering: null })}
              >
                <iframe
                  style={{
                    height: "400%",
                    width: "400%",
                    overflow: "hidden",
                    borderRadius: 5,
                    transform: "scale(0.25)",
                    transformOrigin: "0 0"
                  }}
                  sandbox="allow-scripts allow-same-origin"
                  scrolling="no"
                  src={`/staticcontent/users/${project.creator}/projects/${
                    project.project_name
                  }/`}
                  frameBorder="0"
                />
                {this.state.hovering === index && (
                  <GridListTileBar
                    title={project.project_name}
                    subtitle={
                      <span>
                        by <b>{project.creator}</b>
                      </span>
                    }
                    actionIcon={
                      <IconButton
                        onClick={() => {
                          history.push(`/${project.project_name}`);
                        }}
                      >
                        <Icon
                          className={`fa fa-code ${classes.icon}`}
                          fontSize="small"
                        />
                      </IconButton>
                    }
                  />
                )}
              </GridListTile>
            ))}
          </GridList>
        </div>
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          maxWidth="md"
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              value={this.state.projectName}
              onChange={e => this.setState({ projectName: e.target.value })}
              label="Project Name"
              helperText={this.state.projectNameErr || this.props.createError}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.createProject} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectList);
