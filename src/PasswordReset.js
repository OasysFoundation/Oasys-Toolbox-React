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
import 'firebase/auth';


import {
  Link,
  withRouter,
} from 'react-router-dom';



const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  passwordOld: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class PasswordReset extends Component {
constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {

    var email = firebase.auth().currentUser.email;
    console.log(email);
    console.log(this.state.passwordOld);
    var that = this;

    firebase.auth()
        .signInWithEmailAndPassword(email, this.state.passwordOld)
        .then(function(user) {
            console.log("successfully logged in");

            firebase.auth().currentUser.updatePassword(that.state.passwordOne).then(function(){
            }).catch(function(err){
              alert(err);
            });

        }).catch(function(err){
            //Do something
            alert(err);
        });
    
    this.setState(() => ({ ...INITIAL_STATE }));

    const {
      history,
    } = this.props;

    history.push('/');
    event.preventDefault();  }

render() {
	const {
      passwordOne,
      passwordTwo,
      passwordOld,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' || passwordOld === '';


    return (
		<Card style={{maxWidth:'350px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
			<CardContent>

				<center>
				<img src={logo} style={{maxWidth:'100px'}}/>
				<Typography style={{marginTop:'20px', marginBottom: '10px', fontSize: '14'}} color="textSecondary">
			            Login to Oasys Education
		          </Typography>
				
				</center>
				 <TextField
              id="password-input"
              label="Old Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={passwordOld}
              onChange={event => this.setState(byPropKey('passwordOld', event.target.value))}

            />
         <TextField
              id="password-input"
              label="New Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={passwordOne}
              onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}

            />
            <TextField
              id="password-input"
              label="Confirm Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={passwordTwo}
              onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}

            />
		      <CardActions style={{marginTop:'15px'}}>
          <Button disabled={isInvalid} variant="raised" color="primary" onClick={this.onSubmit.bind(this)} >
		        Reset Password
		      </Button>
		      { error && <p>{error.message}</p> }
		      </CardActions>
			</CardContent>
		</Card>
    	)
}
}
export default withRouter(PasswordReset);  