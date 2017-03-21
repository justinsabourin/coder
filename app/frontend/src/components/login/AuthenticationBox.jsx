import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from '../shared/Loader.jsx';


class AuthenticationBox extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            usernameError: null,
            passwordError: null,
            username: "",
            password: ""
        }
    }  

    onSubmit(e) {
        e.preventDefault()
        var username = this.state.username;
        var password = this.state.password;

        const errors = {
            usernameError: null,
            passwordError: null,
        }

        if (username.length < 3 || username.length > 15) {
            errors.usernameError = "Username must be between 3 and 15 characters";
        }
        else if (!username.match(/^[0-9a-zA-Z]+$/)) {
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
        

        var primary = props.onPrimary ? 
            <RaisedButton 
                label={props.primaryLabel} 
                type="submit"
                primary={true} 
                style={{margin: 12}} />
            : null;
        var secondary = props.onSecondary ?
            <FlatButton
                secondary={true}
                label={props.secondaryLabel} 
                onClick={props.onSecondary}/>
            : null;

        var usernameError = props.authError.username || this.state.usernameError;
        var passwordError = props.authError.password || this.state.passwordError;
        
        return <div className="login-container">
            {props.isLoading &&
                <Loader />
            }
            <div className="login-box">
                <div className="login-header">
                    {props.headerText}
                </div>
                <form className="login-body" onSubmit={this.onSubmit.bind(this)}>
                    <div className="login-input">
                        <TextField
                            hintText="Username"
                            ref={(username) => this.username = username}
                            floatingLabelText="Username"
                            value={this.state.username}
                            onChange={(e) => this.setState({ username: e.target.value })}
                            floatingLabelStyle={{fontFamily: 'Indie Flower', fontSize: '1.7em'}}
                            errorText={usernameError}
                        />
                        <TextField
                            hintText="Password"
                            ref={(password) => this.password = password}
                            floatingLabelText="Password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            floatingLabelStyle={{fontFamily: 'Indie Flower', fontSize: '1.7em'}}
                            type="password"
                            errorText={passwordError}
                        />
                        <div className="login-buttons">
                            {secondary}
                            {primary}
                        </div>
                    </div>
                    <div className="login-alternative">
                        <FlatButton
                            href="/api/auth/github"
                            label="Sign in with Github"
                            icon={<FontIcon className="fa fa-github" />}
                        />
                    </div>
                    
                </form>    
            </div>
        </div>;
    }
}

export default AuthenticationBox;