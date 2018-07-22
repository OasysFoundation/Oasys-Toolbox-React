import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
//import { auth } from './firebase';

import firebase from 'firebase/app';
import 'firebase/auth';


import {withRouter} from 'react-router-dom';



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
    this.state = {
      oldPwError : false,
      newPwError : false
    }
  }

  onSubmit = (event) => {

    var email = firebase.auth().currentUser.email;
    console.log(email);
    console.log(this.state.passwordOld);
    var that = this;
    var newPw = this.state.passwordOne;
    firebase.auth()
        .signInWithEmailAndPassword(email, this.state.passwordOld)
        .then(function(user) {
            console.log("successfully logged in");

            firebase.auth().currentUser.updatePassword(newPw).then(function(){
              const {
                history,
              } = that.props;

              history.push('/');
              event.preventDefault(); 
            }).catch(function(error){
              console.log("actually failed 1");
              console.log(error);
              that.setState(byPropKey('error', error));
              if(error.code==="auth/weak-password"){
                that.setState({newPwError:true})
                that.setState({oldPwError:false})
              }
            });

        }).catch(function(error){
            //Do something
            console.log("actually failed 2");

            that.setState(byPropKey('error', error));
            if(error.code==="auth/wrong-password"){
                that.setState({newPwError:false})
                that.setState({oldPwError:true})
              }
        });
    
    this.setState(() => ({ ...INITIAL_STATE }));

   }

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
              error={this.state.oldPwError}
              id="password-input"
              label="Old Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={this.state.passwordOld}
              onChange={event => this.setState(byPropKey('passwordOld', event.target.value))}

            />
         <TextField
              error={this.state.newPwError}
              id="password-input"
              label="New Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={this.state.passwordOne}
              onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}

            />
            <TextField
              error={this.state.newPwError}
              id="password-input"
              label="Confirm Password"
              style={{width:'100%'}} 
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={this.state.passwordTwo}
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
    </div>
    	)
}
}
export default withRouter(PasswordReset);  