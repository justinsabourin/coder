import React from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/userActions.jsx";
import { clearAuthError } from "../../actions/uiActions.jsx";
import history from "../../history.js";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Loader from "../shared/Loader.jsx";
import Logo from "../shared/Logo.jsx";

const LoginContainer = styled.div`
   {
    width: 100%;
    height: 100%;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: "Roboto";
    color: gray;
  }
`;

const LoginBox = styled.div`
   {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 350px;
    background: white;
    border: 1px solid gray;
    border-radius: 10px;
  }
`;

const LoginHeader = styled.div`
   {
    font-family: "Raleway", cursive;
    text-align: center;
    font-size: 1.9em;
    padding: 6px 0;
    border-bottom: 1px solid gray;
  }
`;

const LoginForm = styled.form`
   {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`;

const LoginInput = styled.div`
   {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid gray;
  }
`;

const LoginButtons = styled.div`
   {
    margin: 9px 0;
  }
`;

const LoginAlternative = styled.div`
   {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

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
    var username = this.state.username;
    var password = this.state.password;

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
    var { props } = this;

    if (props.isLoggedIn) {
      return <Redirect to="/" />;
    }

    var usernameError = props.authError.username || this.state.usernameError;
    var passwordError = props.authError.password || this.state.passwordError;

    return (
      <LoginContainer>
        <LoginBox>
          <LoginHeader>
            <Logo />
          </LoginHeader>
          <LoginForm onSubmit={this.onSubmit.bind(this)}>
            <LoginInput>
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
              <LoginButtons>
                <Button variant="contained" color="primary" type="submit">
                  {props.primaryLabel}
                </Button>
              </LoginButtons>
            </LoginInput>
            <LoginAlternative>
              {/* {<FlatButton
                href="/api/auth/github"
                label="Sign in with Github"
                icon={<FontIcon className="fa fa-github" />}
              />} */}
            </LoginAlternative>
          </LoginForm>
        </LoginBox>
      </LoginContainer>
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
)(AuthenticationBox);

export default Login;
