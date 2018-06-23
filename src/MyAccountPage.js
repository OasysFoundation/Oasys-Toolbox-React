import {Component} from 'react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconAccountCircle from '@material-ui/icons/AccountCircle';

class MyAccountPage extends Component {
	render() {
		return (
				<center>
			      <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign:'left'}} elevation={4}>
			        <Typography variant="headline" component="h3">
			          <IconAccountCircle /> Welcome, Frederik!
			        </Typography>
			        <Typography component="p">
			          This is your personal user account page. You see all your content here. In the future. Right now, this is just a demo text.
			        </Typography>
			      </Paper>
			    </center>
			)
	}
}

export default MyAccountPage;