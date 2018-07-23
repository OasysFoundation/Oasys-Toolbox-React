import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
import { auth } from './firebase';
import firebase from 'firebase/app';

import {
  withRouter,
} from 'react-router-dom';



const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class LoginPage extends Component {
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
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        
        var user = firebase.auth().currentUser;
        if (user) {
          console.log("User ID: " + user.uid);
        }

        history.push('/');
      })
      .catch(error => {
        this.setState(byPropKey('error', error));

        if(error.code==="auth/invalid-email" || error.code==="auth/user-not-found" || error.code === "auth/user-disabled"){
        	this.setState({emailError:true})
        	this.setState({passwordError:false})
        }
        if(error.code==="auth/wrong-password"){
        	this.setState({emailError:false})
        	this.setState({passwordError:true})
        }

      });

    event.preventDefault();
  }

  forgotPw = () => {
 	const {
      history,
    } = this.props;

	history.push('/forgotPassword');  	
  }

  signup = (event) => {
   
    const {
      history,
    } = this.props;

    history.push('/signup');
    event.preventDefault();
  }

render() {
	const {
      email,
      password,
      error,
    } = this.state;

     const isInvalid =
      password === '' ||
      email === '';

    return (
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px"}}>
    <Card style={{maxWidth:'90%'}}>			
      <CardContent>

				<center>
				<img src={logo} style={{maxWidth:'100px'}} alt=""/>
				<Typography style={{marginTop:'20px', marginBottom: '10px', fontSize: '14'}} color="textSecondary">
			            Login to Oasys Education
		          </Typography>
				
				</center>
				<TextField
				  error={this.state.emailError}
	              id="name"
	              label="Email Address"
	              style={{width:'100%'}} 
	              value={email} 
	              margin="normal"
	              type="email"
          		  onChange={event => this.setState(byPropKey('email', event.target.value))}
	            />
		        <TextField
		          error={this.state.passwordError}
		          id="password-input"
		          label="Password"
		          style={{width:'100%'}} 
		          type="password"
		          autoComplete="current-password"
		          margin="normal"
		          value={password}
		          onChange={event => this.setState(byPropKey('password', event.target.value))}

		        />
		      <CardActions style={{marginTop:'15px'}}>
              <Button disabled={isInvalid} variant="raised" color="primary" onClick={this.onSubmit.bind(this)} >
		        Sign In
		      </Button>
		      <Button variant="raised" color="primary" onClick={this.signup.bind(this)} >
		        Sign up
		      </Button>
		      <Button variant="raised" color="primary" onClick={this.forgotPw.bind(this)} >
		        Forgot Password
		      </Button>
		      </CardActions>
		      { error && <p>{error.message}</p> }

			</CardContent>
		</Card>
    </div>
    	)
}
}
export default withRouter(LoginPage);