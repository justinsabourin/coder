import React from "react";
import { connect } from "react-redux";
import Loader from "./Loader.jsx";
import { Route, Redirect } from "react-router-dom";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isLoggingIn) {
      return <Loader />;
    } else {
      let {
        component: Component,
        redirect,
        isLoggedIn,
        isLoggingIn,
        ...rest
      } = this.props;
      return (
        <Route
          {...rest}
          render={props =>
            isLoggedIn ? <Component {...props} /> : <Redirect to={redirect} />
          }
        />
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.auth.isLoggedIn,
    isLoggingIn: state.user.auth.isLoggingIn
  };
};

export default connect(mapStateToProps)(PrivateRoute);
