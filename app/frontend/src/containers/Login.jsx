import React from 'react';
import AuthenticationBox from '../components/login/AuthenticationBox.jsx'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { loginUser } from '../actions/userActions.jsx';
import { clearAuthError } from '../actions/uiActions.jsx'



const mapStateToProps = (state) => {
    return {
        headerText: 'Log in',
        primaryLabel: 'Log in',
        secondaryLabel: 'Sign up',
        isLoading: state.user.auth.isLoggingIn,
        authError: state.ui.authenticationError
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPrimary: (payload) => {
            dispatch(loginUser(payload))
        },
        onSecondary: () => {
            dispatch(clearAuthError())
            browserHistory.push('/signup')
        },
    };
}

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationBox);

export default Login;