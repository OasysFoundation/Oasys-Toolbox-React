import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import FormData from 'form-data';



class UploadPicContentDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contents: [],
			didLoadContent: false
		}

		this.didSelectContent.bind(this);


       	this.state = {
      		imageURL: '',
    	};

    	this.handleUploadProfilePic = this.handleUploadProfilePic.bind(this);
    	this.handleUploadTitlePic = this.handleUploadTitlePic.bind(this);

	}


  handleUploadTitlePic(ev) {
    ev.preventDefault();
    var uid = this.props.authUser.displayName;
    var contentId = this.props.contentId;
    const spacesEndpoint = 'https://api.joinoasys.org/uploadTitle/'+uid+'/'+contentId

    const data = new FormData();
    data.append('upload', this.uploadInput.files[0]);
    data.append('name', uid);
    //data.append('filename', 'profile_pic_' + this.props.authUser);


	

    var that = this;
    fetch(spacesEndpoint, {
      method: 'POST',
      body: data,
      arrayKey:'',
    }).then((response) => {
      response.json()
      .catch(error => {
      console.error('Error:', error);
      this.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
    }).then((body) => {
      	console.log(body);
      	if(body){
      		this.props.snackBarControl('Picture Uploaded Successfully');

      	}
        that.props.url();
      });
    });
    this.props.onClose(null);

  }

  handleUploadProfilePic(ev) {
    ev.preventDefault();
    var uid = this.props.authUser.uid;
    const spacesEndpoint = 'https://api.joinoasys.org/uploadProfilePic/'+uid

    const data = new FormData();
    data.append('upload', this.uploadInput.files[0]);
    data.append('name', uid);
    //data.append('filename', 'profile_pic_' + this.props.authUser);

    var that = this;
    fetch(spacesEndpoint, {
      method: 'POST',
      body: data,
      arrayKey:'',
    }).then((response) => {
      response.json().catch(error => {
      console.error('Error:', error);
      this.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
    }).then((body) => {
      	console.log(body);
      	if(body){
      		this.props.snackBarControl('Picture Uploaded Successfully');

      	}
        that.props.pic();
      });
    });
    this.props.onClose(null);

  }

	handleClose() {
		this.props.onClose(null);
	};

	didSelectContent(selectedContent) {
		this.props.onClose(selectedContent);
	}

	render() {
		

		return (
			<Dialog onClose={this.handleClose} open={this.props.open}>
		        <DialogTitle id="simple-dialog-title">Upload Profile Picture</DialogTitle>
		        <div>

		          <form onSubmit={ this.props.titleUpload
		          	? this.handleUploadTitlePic
		          	: this.handleUploadProfilePic
		          }>
			        <div>
			          <input ref={(ref) => { this.uploadInput = ref; }} name="file" type="file" />
			        </div>
			        <br />
			        
			        {
			        	this.state.imageURL
			        	? <img src={this.state.imageURL} alt="img" />
			        	: null
			        }
			      </form>
		        </div>
		         <DialogActions>
		            <Button onClick={ this.props.titleUpload
		          	? this.handleUploadTitlePic
		          	: this.handleUploadProfilePic
		          } color="primary">
		              Upload
		            </Button>
		            <Button onClick={this.handleClose.bind(this)} color="primary">
		              Cancel
		            </Button>
		        </DialogActions>
		      </Dialog>
			)
	}
}




export default UploadPicContentDialog;