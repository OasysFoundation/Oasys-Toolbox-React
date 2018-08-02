import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
import {auth} from './firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import {withRouter} from 'react-router-dom';
import api from './tools'


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
        this.state = {
            emailError: false,
            passwordError: false,
            userNameError: false,
            uid: '',
        }
    }

    onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {

                var user = firebase.auth().currentUser;

                if (user) {
                    console.log("User ID: " + user.uid);
                }

                this.setState({uid: user.uid});

                var that = this;
                user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  api.postNewUserName(user.uid, username, idToken)
                    .then((body) => {
                            console.log(body);
                            if (body.userNameExists)
                                that.setState({userNameError: true});
                            else if (body.hyphen)
                                that.setState({userNameError: true});
                            else if (!body.userNameExists && !body.hyphen) {
                                user.updateProfile({
                                    displayName: username,
                                }).then(function () {
                                    // Update successful.
                                }).catch(function (error) {
                                    // An error happened.
                                    console.log("error here");
                                    console.log(error);
                                });
                                that.setState(() => ({...INITIAL_STATE}));
                                history.push({
                                    pathname: '/',
                                })
                            }
                    });

                }).catch(function(error) {
                  console.log(error);
                });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
                if (error.code === "auth/invalid-email" || error.code === "auth/email-already-in-use") {
                    this.setState({emailError: true})
                    this.setState({passwordError: false})
                }
                if (error.code === "auth/weak-password") {
                    this.setState({emailError: false})
                    this.setState({passwordError: true})
                }
            });


        event.preventDefault();
    }

    newUserName = (event) => {

        const {
            history,
        } = this.props;

        var user = firebase.auth().currentUser;
        var uid = this.state.uid;
        var username = this.state.username;

        var that = this;
        user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  api.postNewUserName(uid, username, idToken).then((body, err) => {
                    if (err) throw err;
                        console.log(body);
                        if (body.userNameExists)
                            that.setState({userNameError: true});
                        else if (body.hyphen)
                            that.setState({userNameError: true});
                        else if (!body.userNameExists) {
                            user.updateProfile({
                                displayName: username,
                            }).then(function () {
                                // Update successful.
                            }).catch(function (error) {
                                // An error happened.
                                console.log("error here");
                                console.log(error);
                            });
                            that.setState(() => ({...INITIAL_STATE}));
                            history.push({
                                pathname: '/',
                            })
                        }
                });

                }).catch(function(error) {
                  console.log(error);
                });


        event.preventDefault();

    }

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (

            <div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: "10px"}}>
                <Card style={{maxWidth: '90%'}}>
                    <CardContent>

                        <center>
                            <img src={logo} style={{maxWidth: '100px'}} alt=""/>
                            <Typography style={{marginTop: '20px', marginBottom: '10px', fontSize: '14'}}
                                        color="textSecondary">
                                Create a new account
                            </Typography>

                        </center>

                        <TextField error={this.state.emailError}
                                   id="email"
                                   label="Email"
                                   style={{width: '100%'}}
                                   value={email}
                                   onChange={event => this.setState(byPropKey('email', event.target.value))}
                                   margin="normal"
                                   autoComplete="email"
                                   type="email"
                        />


                        <TextField error={this.state.userNameError}
                                   id="username"
                                   label="Username"
                                   style={{width: '100%'}}
                                   value={this.state.username}
                                   onChange={event => this.setState(byPropKey('username', event.target.value))}
                                   margin="normal"
                                   type="text"
                        />

                        <TextField
                            error={this.state.passwordError}
                            id="password-input"
                            value={this.state.passwordOne}
                            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                            label="Password"
                            style={{width: '100%'}}
                            type="password"
                            autoComplete="new-password"
                            margin="normal"
                        />
                        <TextField
                            error={this.state.passwordError}
                            id="password-input"
                            value={this.state.passwordTwo}
                            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                            label="Confirm Password (Must Match)"
                            style={{width: '100%'}}
                            type="password"
                            autoComplete="new-password"
                            margin="normal"
                        />
                        <CardActions style={{marginTop: '15px'}}>
                            <Button disabled={isInvalid} variant="raised" onClick={this.state.userNameError
                                ? this.newUserName.bind(this)
                                : this.onSubmit.bind(this)} color="primary" autoFocus>
                                Sign Up
                            </Button>
                            {error && <p>{error.message}</p>}
                        </CardActions>
                    </CardContent>
                </Card>
            </div>
        )
    }

}


export default withRouter(SignupPage);

