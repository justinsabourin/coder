import React from "react";
import { connect } from "react-redux";

import {
  addFile,
  terminateFileAdd,
  selectFile,
  startFileAdd,
  deleteFile
} from "../../actions/directoryTreeActions.jsx";
import { openFile } from "../../actions/filesActions.jsx";

import Drawer from "@material-ui/core/Drawer";

import FileList from "./tree/FileList.jsx";
import File from "./tree/File.jsx";
import Directory from "./tree/Directory.jsx";
import NewNode from "./tree/NewNode.jsx";
import { withStyles } from "@material-ui/core";
import { FileListHeader } from "./tree/FileListSection.jsx";
import FileListIconButton from "./tree/FileListIconButton.jsx";
import FileListContainer from "./tree/FileListContainer.jsx";

const styles = theme => ({
  drawer: {
    width: theme.drawer.width,
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.drawer.width,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontFamily: "Roboto"
  },
  tree: {
    margin: 5,
    maxHeight: "100%"
  }
});

class DirectoryTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: null
    };
  }

  generateAddNode(type) {
    return () => this.props.startFileAdd(type);
  }

  onFileSelect(path, type) {
    this.props.selectFile(path, type);
    if (type === "F") {
      this.props.openFile(path);
    }
  }

  createNode(fileName) {
    if (!fileName) {
      this.state.tooltip = null;
      return this.props.terminateFileAdd();
    }
    var path = (this.props.selected.path || "") + "/" + fileName;
    if (this.props.tree[path]) {
      this.setState({ tooltip: "File already exists" });
    } else {
      this.state.tooltip = null;
      this.props.addFile(path);
    }
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render() {
    const style = { backgroundColor: "rgba(0, 188, 212, 0.2)" };
    let { selected, classes } = this.props;
    let fileName = selected.path && selected.path.split("/").slice(-1)[0];
    let addDisabled = selected.type === "F";
    let deleteDisabled =
      this.props.disableTrash ||
      !selected.path ||
      selected.path === "/index.html";

    const treeCreate = path => {
      var node = this.props.tree[path];
      return node.node_type === "F" ? (
        <File
          key={node.path}
          style={node.path === this.props.selected.path ? style : undefined}
          onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}
        >
          {node.name}
        </File>
      ) : (
        <Directory
          key={node.path}
          file={node}
          open={node.open}
          style={node.path === this.props.selected.path ? style : undefined}
          onSelect={this.onFileSelect.bind(this, node.path, node.node_type)}
        >
          {node.children && node.children.map(treeCreate)}
          {this.props.newFile.type && this.props.selected.path === node.path ? (
            <NewNode
              onEnter={this.createNode.bind(this)}
              type={this.props.newFile.type}
              tooltip={this.state.tooltip}
            />
          ) : null}
        </Directory>
      );
    };

    return (
      <div onClick={() => this.props.selectFile()}>
        <Drawer
          open={this.props.open}
          anchor="right"
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant="persistent"
        >
          <FileListContainer
            className={classes.tree}
            onClick={this.stopPropagation}
          >
            <FileListHeader>
              <FileListIconButton
                disabled={deleteDisabled}
                onClick={this.props.deleteFile}
                className="fa fa-trash"
              >
                {deleteDisabled ? "" : "Delete " + fileName}
              </FileListIconButton>
              <FileListIconButton
                disabled={addDisabled}
                onClick={this.generateAddNode("F")}
                className="fa fa-file"
              >
                {addDisabled ? "" : "Create File"}
              </FileListIconButton>
              <FileListIconButton
                disabled={addDisabled}
                onClick={this.generateAddNode("D")}
                className="fa fa-folder"
              >
                {addDisabled ? "" : "Create Folder"}
              </FileListIconButton>
            </FileListHeader>
            <FileList>
              {Object.keys(this.props.tree)
                .reduce(
                  (accum, path) =>
                    path.split("/").length === 2 ? accum.concat(path) : accum,
                  []
                )
                .map(treeCreate)}
              {this.props.newFile.type && !this.props.selected.path ? (
                <NewNode
                  onEnter={this.createNode.bind(this)}
                  type={this.props.newFile.type}
                  tooltip={this.state.tooltip}
                />
              ) : null}
            </FileList>
          </FileListContainer>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tree: state.directoryTree.tree,
    selected: state.directoryTree.selected,
    newFile: state.directoryTree.newFile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openFile: path => {
      dispatch(openFile(path));
    },
    addFile: path => {
      dispatch(addFile(path));
    },
    terminateFileAdd: () => {
      dispatch(terminateFileAdd());
    },
    selectFile: (path, type) => {
      dispatch(selectFile(path, type));
    },
    startFileAdd: type => {
      dispatch(startFileAdd(type));
    },
    deleteFile: () => {
      dispatch(deleteFile());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DirectoryTree));
