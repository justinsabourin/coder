import React from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/userActions.jsx";
import { clearAuthError } from "../../actions/uiActions.jsx";
import history from "../../history.js";
import { Redirect } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Loader from "../shared/Loader.jsx";
import Logo from "../shared/Logo.jsx";

const style = theme => ({
  loginContainer: {
    width: "100%",
    height: "100%",
    minHeight: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.light
  },
  loginBox: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    width: 350,
    height: 350,
    background: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: 10
  },
  loginHeader: {
    fontFamily: theme.typography.fontFamily,
    textAlign: "center",
    fontSize: "1.9em",
    padding: 6,
    borderBottom: `1px solid ${theme.palette.primary.light}`
  },
  loginForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  loginInput: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.primary.light}`
  },
  loginButtons: {
    margin: "9px 0"
  },
  loginAlternative: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

const styles = theme => ({
  tooltip: {
    backgroundColor: theme.palette.error.main
  }
});

const ErrorTooltip = withStyles(styles)(Tooltip);

class AuthenticationBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameError: null,
      passwordError: null,
      username: "",
      password: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    let username = this.state.username;
    let password = this.state.password;

    const errors = {
      usernameError: null,
      passwordError: null
    };

    if (username.length < 3 || username.length > 15) {
      errors.usernameError = "Username must be between 3 and 15 characters";
    } else if (!username.match(/^[0-9a-zA-Z]+$/)) {
      errors.usernameError = "Username can only contain letters and numbers";
    }
    if (password.length < 4 || password.length > 20) {
      errors.passwordError = "Password must be between 4 and 20 characters";
    }
    this.setState(errors);
    if (!errors.passwordError && !errors.usernameError) {
      this.props.onPrimary({
        username,
        password
      });
    }
  }

  render() {
    let { props } = this;
    let { classes } = props;

    if (props.isLoggedIn) {
      return <Redirect to="/" />;
    }

    let usernameError = props.authError.username || this.state.usernameError;
    let passwordError = props.authError.password || this.state.passwordError;

    return (
      <div className={classes.loginContainer}>
        <div className={classes.loginBox}>
          <div className={classes.loginHeader}>
            <Logo />
          </div>
          <form
            className={classes.loginForm}
            onSubmit={this.onSubmit.bind(this)}
          >
            <div className={classes.loginInput}>
              <ErrorTooltip
                open={!!this.state.usernameError}
                title={this.state.usernameError || ""}
                placement="right"
              >
                <TextField
                  error={!!this.state.usernameError}
                  label="Username"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
                  variant="outlined"
                  margin="normal"
                  autoComplete="username"
                />
              </ErrorTooltip>
              <ErrorTooltip
                open={!!this.state.passwordError}
                title={this.state.passwordError || ""}
                placement="right"
              >
                <TextField
                  error={!!this.state.passwordError}
                  label="Password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                  variant="outlined"
                />
              </ErrorTooltip>
              <div className={classes.loginButtons}>
                <Button variant="contained" color="primary" type="submit">
                  {props.primaryLabel}
                </Button>
              </div>
            </div>
            <div className={classes.loginAlternative}>
              {/* {<FlatButton
                href="/api/auth/github"
                label="Sign in with Github"
                icon={<FontIcon className="fa fa-github" />}
              />} */}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    primaryLabel: "log in",
    isLoggedIn: state.user.auth.isLoggedIn,
    authError: state.ui.authenticationError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPrimary: payload => {
      dispatch(loginUser(payload));
    },
    onSecondary: () => {
      dispatch(clearAuthError());
      history.push("/signup");
    }
  };
};

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(style)(AuthenticationBox));

export default Login;
