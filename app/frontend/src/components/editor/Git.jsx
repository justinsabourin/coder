import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import {
  selectFileForStage,
  commitFiles,
  stageFiles
} from "../../actions/gitActions.jsx";

import Drawer from "@material-ui/core/Drawer";
import { withStyles, TextField, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FileList from "./tree/FileList.jsx";
import File from "./tree/File.jsx";
import FileListTitle from "./tree/FileListTitle.jsx";
import { FileListFooter, FileListHeader } from "./tree/FileListSection.jsx";
import FileListButton from "./tree/FileListButton.jsx";
import FileListContainer from "./tree/FileListContainer.jsx";

const chipStyle = {};

const styles = theme => ({
  drawer: {
    height: theme.gitDrawer.height
  },
  drawerPaper: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    height: theme.gitDrawer.height
  },
  container: {
    height: "100%",
    display: "flex",
    margin: 10
  },
  fileListContainer: {
    minWidth: 310
  },
  fileList: {
    padding: 0
  },
  file: {
    borderRadius: 0,
    margin: 0,
    padding: "5px"
  },
  badge: {
    height: 20,
    width: 20,
    borderRadius: "50%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    marginLeft: "auto"
    // The border color match the background color.
    //border: `2px solid ${theme.palette.primary.contrastText}`
  },
  fileSelected: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main
  },
  NEW: {
    color: "#0a9900",
    backgroundColor: "rgba(191, 232, 187, 0.7)"
  },
  MODIFIED: {
    color: "#027bd8",
    backgroundColor: "rgba(179, 210, 219, 0.7)"
  },
  CONFLICTED: {
    color: "#ccad02",
    backgroundColor: "rgba(247, 246, 187, 0.7)"
  },
  DELETED: {
    color: "#e21d1d",
    backgroundColor: "rgba(252, 171, 171, 0.7)"
  },
  RENAMED: {}
});

class Git extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: false
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    let { classes, status } = this.props;
    return (
      <Drawer
        variant="persistent"
        anchor="bottom"
        open={this.props.open}
        classes={{
          paper: classNames(this.props.classNames.gitPaper, classes.drawerPaper)
        }}
      >
        <div className={classes.container}>
          <FileListContainer className={classes.fileListContainer}>
            <FileListHeader align="center">
              <FileListButton
                onClick={this.props.selectFileForStage.bind(this, "all")}
                color="secondary"
                size="xs"
              >
                Select all
              </FileListButton>
              <FileListTitle>Unstaged Changes</FileListTitle>
              <FileListButton
                onClick={this.props.selectFileForStage.bind(this, "none")}
                color="secondary"
                size="xs"
              >
                Unselect all
              </FileListButton>
            </FileListHeader>
            <FileList className={classes.fileList}>
              {status.unstaged.map(file => (
                <File
                  className={classNames(classes.file, {
                    [classes.fileSelected]: file.selectedForStage,
                    [classes[file.type]]: !file.selectedForStage
                  })}
                  key={file.path}
                  onSelect={this.props.selectFileForStage.bind(this, file.path)}
                >
                  {file.path}
                  <span
                    className={classNames(classes.badge, {
                      [classes.fileSelected]: file.selectedForStage,
                      [classes[file.type]]: !file.selectedForStage
                    })}
                  >
                    {file.type[0]}
                  </span>
                </File>
              ))}
            </FileList>
            <FileListFooter align="right">
              <FileListButton onClick={this.props.stageFiles} color="primary">
                Stage
              </FileListButton>
            </FileListFooter>
          </FileListContainer>
          <FileListContainer
            className={classes.fileListContainer}
            style={{ marginLeft: "auto" }}
          >
            <FileListHeader align="center">
              <FileListTitle>Staged Changes</FileListTitle>
            </FileListHeader>
            <FileList className={classes.fileList}>
              {status.staged.map(file => (
                <File
                  className={classNames(classes.file, classes[file.type])}
                  key={file.path}
                >
                  {file.path}
                  <span
                    className={classNames(classes.badge, classes[file.type])}
                  >
                    {file.type[0]}
                  </span>
                </File>
              ))}
            </FileList>
            <FileListFooter>
              <FileListButton color="secondary">Unstage</FileListButton>
              <FileListButton
                onClick={this.handleClickOpen.bind(this)}
                color="primary"
              >
                Commit
              </FileListButton>
            </FileListFooter>
          </FileListContainer>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Commit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To commit, please enter a descriptive message.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
              label="Commit Message"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.props.commitFiles(this.state.message);
                this.handleClose();
              }}
              color="primary"
            >
              Commit
            </Button>
          </DialogActions>
        </Dialog>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: {
      staged: Object.values(state.git.status.staged),
      unstaged: Object.values(state.git.status.unstaged)
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectFileForStage: path => {
      dispatch(selectFileForStage(path));
    },
    commitFiles: message => {
      dispatch(commitFiles(message));
    },
    stageFiles: () => {
      dispatch(stageFiles());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Git));
