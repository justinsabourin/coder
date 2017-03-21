import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import Login from './containers/Login.jsx';
import Signup from './containers/Signup.jsx';
import AuthenticateContainer from './containers/AuthenticateContainer.jsx';
import Projects from './components/projects/Projects.jsx';
import Project from './components/editor/Project.jsx';
import reducers from './reducers/index.jsx';
import loginRedirect from './middleware/loginRedirect.jsx';


import "./touchtap.jsx";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



const muiTheme = getMuiTheme();

const middlewares = [thunk, loginRedirect];

if (process.env.NODE_ENV !== `production`) {
  if (module.hot) {
    module.hot.accept('./reducers/index.jsx', () => {
      const nextRootReducer = require('./reducers/index.jsx');
      store.replaceReducer(nextRootReducer);
    });
  }
  const createLogger = require(`redux-logger`);
  const logger = createLogger();
  middlewares.push(logger);
}



const store = compose(applyMiddleware(...middlewares))(createStore)(reducers)

const onEnter = (x, replace) => {
  console.log(store.getState().user.auth.isLoggedIn)
  if (store.getState().user.auth.isLoggedIn) {
    replace({ pathname: '/' })
  }
}

render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/signup" component={Signup}/>
        <Route path="/login" component={Login} />
        <Route  component={AuthenticateContainer} >
          <Route path="/" component={Projects}/>
          <Route path="/:project" component={Project} />
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>
), document.getElementById('app'))
