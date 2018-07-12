import {Component} from 'react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg';
import UserMainPage from './UserMainPage';
import LoginPage from './LoginPage'

class MyAccountPage extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		console.log("niii");
		console.log(this.props.authUser);
		return (
			<div>
			{ !this.props.authUser ?(
				 null
				 )
					: (
						this.props.authUser == "loggedOut" ? (
						 <LoginPage/>
					    )
					    : (
						 <UserMainPage authUser={this.props.authUser}/>
						)
					   )
			}
			</div>
		)
	}
}


export default MyAccountPage;