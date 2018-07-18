import {Component} from 'react';
import React from 'react';
import UserMainPage from './UserMainPage';
import LoginPage from './LoginPage'

class MyAccountPage extends Component {

	render() {
		console.log("niii");
		console.log(this.props.authUser);
		return (
			<div>
			{ !this.props.authUser ?(
				 null
				 )
					: (
						this.props.authUser === "loggedOut" ? (
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