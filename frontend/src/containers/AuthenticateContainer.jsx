import React from 'react';
import { connect } from 'react-redux';
import { checkUser }  from '../actions/userActions.jsx';
import Loader from '../components//shared/Loader.jsx';


class AuthenticateContainer extends React.Component {

    constructor(props) {
        super(props);
        if (!props.isLoggedIn && !props.isLoggingIn) {
            props.checkAuth();
        }
        
    }

    render() {
        if (this.props.isLoggingIn) {
            return <Loader />
        } else if (this.props.isLoggedIn) {
            return this.props.children;
        } else {
            return <span>Something went wrong, try refreshing</span>;
        }
    }
}


const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.auth.isLoggedIn,
    isLoggingIn: state.user.auth.isLoggingIn
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => {
            dispatch(checkUser())
        }
    };
}



export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateContainer)