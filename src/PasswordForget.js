import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
import { auth } from './firebase';


import {
  Link,
  withRouter,
} from 'react-router-dom';



const INITIAL_STATE = {
  email: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class PasswordForget extends Component {
constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    const {
      history,
    } = this.props;

    history.push('/');
    event.preventDefault();


  }

render() {
	const {
      email,
      error,
    } = this.state;

  const isInvalid = email === '';


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
	              id="name"
	              label="Email Address"
	              style={{width:'100%'}} 
                value={this.state.email}
	              margin="normal"
	              type="email"
          		  onChange={event => this.setState(byPropKey('email', event.target.value))}
	            />
		      <CardActions style={{marginTop:'15px'}}>
          <Button disabled={isInvalid} variant="raised" color="primary" onClick={this.onSubmit.bind(this)} >
		        Submit
		      </Button>
		      { error && <p>{error.message}</p> }
		      </CardActions>
			</CardContent>
		</Card>
    	)
}
}
export default withRouter(PasswordForget);