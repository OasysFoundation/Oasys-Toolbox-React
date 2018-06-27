import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import Typography from '@material-ui/core/Typography';

class LoginPage extends Component {
 

  render() {
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
	              value={this.props.value} 
	              onChange={this.onChange}
	              margin="normal"
	              type="email"
	            />
		        <TextField
		          id="password-input"
		          label="Password"
		          style={{width:'100%'}} 
		          type="password"
		          autoComplete="current-password"
		          margin="normal"
		        />
		      <CardActions style={{marginTop:'15px'}}>
			  <Button variant="contained" color="primary" >
		        Forgot password?
		      </Button>
              <Button variant="raised" color="primary" >
		        Login
		      </Button>
		      </CardActions>
			</CardContent>
		</Card>
    	)
}
}

export default LoginPage;