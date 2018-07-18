import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DoneIcon from '@material-ui/icons/CheckCircle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';


class PublishedCheerDialog extends Component {

	constructor(props) {
    	super(props);
    }

    goToContentPage() {
    	window.location.href = this.props.sharableLink;
    }

	render() {
		return (
			<div>
				<Dialog open={this.props.open} onClose={this.props.onClose}>
        			<center style={{marginTop: '40px'}}>
                    	<DoneIcon color="secondary" style={{fontSize: '100px'}}/>
                    </center>
                    <DialogTitle id="simple-dialog-title">Content Successfully Uploaded</DialogTitle>
                    <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Congratulations, your work has been published on Oasys! Share this link so others can access your content: 
		            </DialogContentText>
		            <a href={this.props.sharableLink}>{this.props.sharableLink}</a>
		            <br />
		            <center style={{marginTop:'20px'}}>
	                  <Button variant="contained" color="secondary" onClick={this.props.onClose}>
				        Cancel
				      </Button>

	                  <Button variant="raised" color="secondary" onClick={this.goToContentPage.bind(this)}>
				        View my Content
				      </Button>
				     </center>
		          </DialogContent>
        		</Dialog>
			</div>
			);
	}
}

export default PublishedCheerDialog;