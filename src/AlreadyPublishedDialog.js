import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DoneIcon from '@material-ui/icons/CheckCircle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



class PublishedCheerDialog extends Component {
	constructor(props) {
		super(props);
		this.state= {
			title:''
		}
	}

	goHome(){
    	window.location.href = window.location.href.replace("create","explore");
	}

	changeTitle(){
		this.props.changeTitle(this.state.title);
		this.props.onClose();
	}

	  onChangeTitle(event) {
	    this.setState({
	      title: event.target.value
	    })
	  }

	render() {

		const {
	      title
	    } = this.state;

	     const isInvalid =
	      title === '' || title === this.props.oldTitle;

		return (
			<div>
				<Dialog open={this.props.open} onClose={this.props.onClose}>
                    <DialogTitle id="simple-dialog-title">Welcome back!</DialogTitle>
                    <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              You are remixing your own content, you cannot use same title.
		            </DialogContentText>

						<TextField
			              autoFocus
			              margin="dense"
			              id="name"
			              label="New title"
			              type="text"
			              fullWidth
			          	  value={this.state.title}
			          	  onChange={this.onChangeTitle.bind(this)}
			            />

		            <center style={{marginTop:'20px'}}>
	                  <Button disabled={isInvalid} variant="contained" color="secondary" onClick={this.changeTitle.bind(this)}>
				        Continue Editing
				      </Button>
	                  <Button variant="raised" color="secondary" onClick={this.goHome.bind(this)}>
				        Go to Homepage
				      </Button>
				     </center>
		          </DialogContent>
        		</Dialog>
			</div>
			);
	}
}

export default PublishedCheerDialog;