import {Component} from 'react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import UploadPicContentDialog from './UploadPicContentDialog'

import {
  Link,
  withRouter,
} from 'react-router-dom';
import UserProjects from './UserProjects'

class UserMainPage extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showsOpenDialog: false,
        	pic : '',
        }
    }

	resetPw = () => {
	 	const {
	      history,
	    } = this.props;

		history.push('/resetPassword');  	
	  }

	  closeOpenDialog(photo) {
	    this.setState({
	      showsOpenDialog: false,
	    });
	  }

	  onUpload() {
	    this.setState({
	      showsOpenDialog: true,
	    });
	  }

	  sendPic(photo){
	  	this.setState({
	  		pic: photo,
	  	});
	  }

	render() {
			return (				

				<center>
			      <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign:'left'}} elevation={4}>
			      <center>
					<img src={this.state.pic || logo} style={{maxWidth:'100px', marginBottom:'16px'}}/>
					</center>
			        <Typography variant="headline" component="h3" style={{marginBottom:'16px'}}>
			          <IconAccountCircle /> Welcome{
			          	this.props.authUser
			          	? ", " + this.props.authUser.displayName
       				    : ""
			          }
			        </Typography>
			        <Typography component="p">
			          You can see all your created content here! 
			        </Typography>

			   <div style={{marginTop:'16px'}}>
			   <Button variant="contained" color="primary" onClick={this.resetPw.bind(this)}>
		        Change Password  
		      </Button>
		      <Button variant="contained" color="primary" onClick={this.onUpload.bind(this)}>
		        Upload Picture  
		      </Button>
		      <UploadPicContentDialog pic={this.sendPic.bind(this)} authUser={this.props.authUser.displayName} open={this.state.showsOpenDialog} onClose={this.closeOpenDialog.bind(this)}/>
		      <br />
		      </div>
			      </Paper>
			      <UserProjects userId={this.props.authUser.displayName}/>
			    </center>
			    )
			}
		}


		export default withRouter(UserMainPage);