import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from '../shared/Loader.jsx';


const AuthenticationBox = (props) => {
    if (props.isLoading) {
        return <Loader />
    }
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
    
    return <div className="login-container">
        <div className="login-box">
            <div className="login-header">
                {props.headerText}
            </div>
            <form className="login-body" onSubmit={(e) => {
                    e.preventDefault();
                    props.onPrimary({
                        username: this.username.input.value,
                        password: this.password.input.value
                    });
                }
                }>
                <div className="login-input">
                    <TextField
                        hintText="Username"
                        ref={(username) => this.username = username}
                        floatingLabelText="Username"
                        floatingLabelStyle={{fontFamily: 'Indie Flower', fontSize: '1.7em'}}
                    />
                    <TextField
                        hintText="Password"
                        ref={(password) => this.password = password}
                        floatingLabelText="Password"
                        floatingLabelStyle={{fontFamily: 'Indie Flower', fontSize: '1.7em'}}
                        type="password"
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

export default AuthenticationBox;