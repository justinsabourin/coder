import React from 'react';
import AuthenticationBox from '../components/login/AuthenticationBox.jsx'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { loginUser } from '../actions/userActions.jsx';

/*const Login = ({ dispatch }) => {
    return <AuthenticationBox
                headerText={"Log in"}
                onPrimary={() => dispatch()}
                primaryLabel={"Log in"} 
                onSecondary={() => browserHistory.push('/signup')}
                secondaryLabel={"Sign up"} />

}*/


const mapStateToProps = (state) => {
    return {
        headerText: 'Log in',
        primaryLabel: 'Log in',
        onSecondary: () => browserHistory.push('/signup'),
        secondaryLabel: 'Sign up',
        isLoading: state.user.auth.isLoggingIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPrimary: (payload) => {
            dispatch(loginUser(payload))
        }
    };
}

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationBox);

export default Login;