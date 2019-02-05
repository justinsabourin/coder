import * as React from "react";
import { connect } from "react-redux";
import { checkUser } from "./actions/userActions.jsx";
import { render } from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import history from "./history";

import createMyTheme from "./styles/createMyTheme";

import Login from "./components/login/Login.jsx";
//import Signup from './containers/Signup.jsx';
import PrivateRoute from "./components/shared/PrivateRoute.jsx";
import Projects from "./components/projects/Projects.jsx";
import Project from "./components/editor/Project.jsx";
import reducers from "./reducers/index.jsx";
import loginRedirect from "./middleware/loginRedirect.jsx";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "brace/mode/html";
import { CssBaseline } from "@material-ui/core";

const theme = createMyTheme({
  palette: {
    primary: {
      main: "#393f3f"
    },
    secondary: {
      main: "#C0C0C0"
    },
    // error: will use the default color
    background: {
      default: "#393f3f"
    }
  },

  typography: {
    useNextVariants: true
  }
});

const middlewares = [thunk, loginRedirect];

/*************************************** */
// Im a bad person, I know
declare var process: {
  env: {
    NODE_ENV: string;
  };
};

declare var require: any;
/***************************************** */
if (process.env.NODE_ENV !== `production`) {
  // if (module.hot) {
  //   module.hot.accept("./reducers/index.jsx", () => {
  //     const nextRootReducer = require("./reducers/index.jsx");
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }
  const createLogger = require(`redux-logger`).createLogger;
  const logger = createLogger();
  middlewares.push(logger);
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducers);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.checkAuth();
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          {/* <Route path="/signup" component={Signup}/> */}
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" redirect="/login" component={Projects} />
          <PrivateRoute
            path="/:project"
            redirect="/login"
            component={Project}
          />
        </Switch>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkAuth: () => {
      dispatch(checkUser());
    }
  };
};

const Application = connect(
  null,
  mapDispatchToProps
)(App);
render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Application />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("app")
);
