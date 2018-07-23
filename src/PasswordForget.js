  import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';
import { auth } from './firebase';


import {withRouter} from 'react-router-dom';



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
    this.state = {
      emailError : false,
    }
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        const {
          history,
        } = this.props;

        history.push('/');
        event.preventDefault();
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        if(error.code==="auth/invalid-email" || error.code==="auth/user-not-found" || error.code === "auth/user-disabled"){
          this.setState({emailError:true})
        }
        else{
          this.setState({emailError:false})
        }

      });

    


  }

render() {
	const {
      email,
      error,
    } = this.state;

  const isInvalid = email === '';


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
    </div>
    	)
}
}
export default withRouter(PasswordForget);