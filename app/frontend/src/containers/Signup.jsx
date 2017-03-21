import React from 'react';
import AuthenticationBox from '../components/login/AuthenticationBox.jsx';
import { signupUser } from '../actions/userActions.jsx';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
    return {
        headerText: 'Sign up',
        primaryLabel: 'Sign up',
        isLoading: state.user.auth.isLoggingIn,
        authError: state.ui.authenticationError
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPrimary: (payload) => {
            dispatch(signupUser(payload))
        }
    };
}

const Signup = connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationBox);


export default Signup;