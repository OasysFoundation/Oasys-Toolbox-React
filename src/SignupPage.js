import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
import { auth } from './firebase';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import firebase from 'firebase/app';
import 'firebase/auth';
import {
  Link,
  withRouter,
} from 'react-router-dom';



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
    this.state = { ...INITIAL_STATE };
    this.state = {
    	emailError : false,
    	passwordError : false
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
        this.setState(() => ({ ...INITIAL_STATE }));
        

		var user = firebase.auth().currentUser

        user.updateProfile({
		  displayName: username,
		}).then(function() {
		  // Update successful.
		}).catch(function(error) {
		  // An error happened.
		  console.log("error here");
		  console.log(error);
		});

		history.push({
		  pathname: '/',
		})

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        if(error.code=="auth/invalid-email" || error.code=="auth/email-already-in-use"){
        	this.setState({emailError:true})
        	this.setState({passwordError:false})
        }
        if(error.code=="auth/weak-password"){
        	this.setState({emailError:false})
        	this.setState({passwordError:true})
        }
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
    	<Card style={{maxWidth:'350px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
			<CardContent>

				<center>
				<img src={logo} style={{maxWidth:'100px'}}/>
				<Typography style={{marginTop:'20px', marginBottom: '10px', fontSize: '14'}} color="textSecondary">
			            Create a new account
		          </Typography>
				
				</center>
 
          		<TextField error={this.state.emailError}
	              id="email"
	              label="Email"
	              style={{width:'100%'}} 
	              value={email} 
          		  onChange={event => this.setState(byPropKey('email', event.target.value))}
	              margin="normal"
	              autoComplete="email"
	              type="email"
	            />

				
				<TextField
	              id="username"
	              label="Username"
	              style={{width:'100%'}} 
	              value={username} 
          		  onChange={event => this.setState(byPropKey('username', event.target.value))}
	              margin="normal"
	              type="text"
	            />

		        <TextField
		          error={this.state.passwordError}
		          id="password-input"
		          value={passwordOne}
		          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
		          label="Password"
		          style={{width:'100%'}} 
		          type="password"
		          autoComplete="new-password"
		          margin="normal"
		        />
		        <TextField 
		          error={this.state.passwordError}
		          id="password-input"
		          value={passwordTwo}
		          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
		          label="Confirm Password (Must Match)"
		          style={{width:'100%'}} 
		          type="password"
		          autoComplete="new-password"
		          margin="normal"
		        />
		      <CardActions style={{marginTop:'15px'}}>
		      <Button disabled={isInvalid} variant="raised" onClick={this.onSubmit.bind(this)} color="primary" autoFocus>
            	Sign Up
          		</Button>
        		{ error && <p>{error.message}</p> }
		      </CardActions>
			</CardContent>
		</Card>
    	)
}

}


export default withRouter(SignupPage);

