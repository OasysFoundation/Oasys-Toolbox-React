import {Component} from 'react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import {
  Link,
  withRouter,
} from 'react-router-dom';
import UserProjects from './UserProjects'

class UserMainPage extends Component {
	constructor(props) {
        super(props);
    }

	resetPw = () => {
	 	const {
	      history,
	    } = this.props;

		history.push('/resetPassword');  	
	  }

	render() {
			return (				

				<center>
			      <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign:'left'}} elevation={4}>
			      <center>
					<img src={logo} style={{maxWidth:'100px', marginBottom:'16px'}}/>
					</center>
			        <Typography variant="headline" component="h3" style={{marginBottom:'16px'}}>
			          <IconAccountCircle /> Welcome{
			          	this.props.authUser
			          	? ", " + this.props.authUser.displayName
       				    : ""
			          }
			        </Typography>
			        <Typography component="p">
			          This is your personal user account page. You see all your content here. In the future. Right now, this is just a demo text.
			        </Typography>

			   <div style={{marginTop:'16px'}}>
			   <Button variant="contained" color="primary" onClick={this.resetPw.bind(this)}>
		        Change Password
		      </Button>
		      <br />
		      </div>
			      </Paper>
			      <UserProjects userId={this.props.authUser.displayName}/>
			    </center>
			    )
			}
		}


		export default withRouter(UserMainPage);