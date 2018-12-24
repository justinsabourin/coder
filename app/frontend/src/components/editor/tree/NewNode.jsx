import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  field: {
    color: theme.palette.primary.contrastText,
    padding: "4px"
  },
  root: {
    display: "flex"
  },
  rootField: {
    flex: 1,
    marginRight: 5
  }
});

class NewNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: null
    };
  }

  handleEnter(e) {
    if (e.key !== "Enter") return;
    if (!this.value) {
      this.props.onEnter(null);
      return;
    }
    var match;
    if (this.props.type === "F") {
      match = this.value.match(/^[a-zA-Z0-9]+.(html|js|css)$/g);
      if (match) {
        this.props.onEnter(this.value);
      } else {
        this.setState({
          tooltip: "Files must be of the form [name].[ html | js | css] "
        });
      }
    } else if (this.props.type === "D") {
      match = this.value.match(/^[a-zA-Z0-9]+$/i);
      if (match) {
        this.props.onEnter(this.value);
      } else {
        this.setState({
          tooltip: "Folders must contain only alphanumberic characters"
        });
      }
    }
  }

  render() {
    let { classes, type } = this.props;
    let hintText = type === "F" ? "File name" : "Folder name";
    let tooltip = this.state.tooltip || this.props.tooltip;
    return (
      <div className={classes.root}>
        <span
          className={"fa fa-" + (type === "F" ? "file" : "folder")}
          style={{ padding: "5px 4px 0 1px" }}
        />
        <TextField
          variant="outlined"
          className={classes.rootField}
          inputProps={{ className: classes.field }}
          onChange={e => (this.value = e.target.value)}
          autoFocus
          error={!!tooltip}
          helperText={tooltip}
          onKeyPress={this.handleEnter.bind(this)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(NewNode);
