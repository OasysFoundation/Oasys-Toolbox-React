import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormData from 'form-data';
import $ from 'jquery';
import api from './tools'

const imageStyle = {
	maxWidth: 250,
}

class UploadPicContentDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contents: [],
			didLoadContent: false,
			uploadPreview: false,
		}

		this.didSelectContent.bind(this);


       	this.state = {
      		imageURL: '',
    	};

    	this.handleUploadProfilePic = this.handleUploadProfilePic.bind(this);
    	this.handleUploadTitlePic = this.handleUploadTitlePic.bind(this);
    	this.readURL = this.readURL.bind(this);

	}


  handleUploadTitlePic(ev) {
    ev.preventDefault();
    var uid = this.props.authUser.displayName;
    var contentId = this.props.contentId;

    const data = new FormData();
    data.append('upload', this.uploadInput.files[0]);
    data.append('name', uid);
    //data.append('filename', 'profile_pic_' + this.props.authUser);
    let that = this;
    let authUser = this.props.authUser;


    if(authUser && authUser.displayName){
            authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            api.postTitlePic(uid, contentId, data, that.props.authUser.uid, idToken).then((response) => {
              response.json()
              .catch(error => {
              console.error('Error:', error);
              that.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
            }).then((body) => {
                console.log(body);
                if(body){
                  console.log("filename:"+body);
                  that.props.snackBarControl('Picture Uploaded Successfully');

                }
                that.props.url();
              });
            });
            }).catch(function(error) {
              console.log(error);
            });

        }
        else{
           api.postTitlePic(uid, contentId, data, "id", "idToken").then((response) => {
              response.json()
              .catch(error => {
              console.error('Error:', error);
              that.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
            }).then((body) => {
                console.log(body);
                if(body){
                  console.log("filename:"+body);
                  that.props.snackBarControl('Picture Uploaded Successfully');

                }
                that.props.url();
              });
            });
        }

    this.props.onClose(null);

  }

  handleUploadProfilePic(ev) {
    ev.preventDefault();
    var uid = this.props.authUser.uid;

    const data = new FormData();
    data.append('upload', this.uploadInput.files[0]);
    data.append('name', uid);
    //data.append('filename', 'profile_pic_' + this.props.authUser);

     let that = this;
    let authUser = this.props.authUser;


    if(authUser && authUser.displayName){
            authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            api.postProfilePic(uid, data, idToken).then((response) => {
              response.json()
              .catch(error => {
              console.error('Error:', error);
              that.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
            }).then((body) => {
                console.log(body);
                if(body){
                  console.log("filename:"+body);
                  that.props.snackBarControl('Picture Uploaded Successfully');

                }
                that.props.url();
              });
            });
            }).catch(function(error) {
              console.log(error);
            });

        }
        else{
           api.postProfilePic(uid, data, "idToken").then((response) => {
              response.json()
              .catch(error => {
              console.error('Error:', error);
              that.props.snackBarControl('Error Uploading Image. If this continues, please contact info@joinoasys.org');
            }).then((body) => {
                console.log(body);
                if(body){
                  console.log("filename:"+body);
                  that.props.snackBarControl('Picture Uploaded Successfully');

                }
                that.props.url();
              });
            });
        }
    this.props.onClose(null);

  }

	handleClose() {
		this.props.onClose(null);
		this.setState({
          uploadPreview:false,
        })
	};

	didSelectContent(selectedContent) {
		this.props.onClose(selectedContent);
	}

	readURL(event) {
		var that = this;
		var input = this.uploadInput;
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#preview')
                        .attr('src', e.target.result);
                     that.setState({
                     	uploadPreview:true,
                     })
                };

                reader.readAsDataURL(input.files[0]);
            }
        }

	render() {
		

		return (
			<Dialog onClose={this.handleClose} open={this.props.open}>
		        <DialogTitle id="simple-dialog-title">Upload Picture</DialogTitle>
		        <div>

		          <form onSubmit={ this.props.titleUpload
		          	? this.handleUploadTitlePic
		          	: this.handleUploadProfilePic
		          }>
			        <div>
			          <input ref={(ref) => { this.uploadInput = ref; }} name="file" type="file" onChange={this.readURL}/>
			        </div>
			        <br />
			        
			        {
			        	this.state.uploadPreview
			        	? <img style={imageStyle} id="preview" src={this.state.imageURL} alt="loading preview.." />
			        	: null
			        }
			      </form>
		        </div>
		         <DialogActions>
		            <Button onClick={this.handleClose.bind(this)} color="primary">
		              Cancel
		            </Button>
		            <Button onClick={ this.props.titleUpload
		          	? this.handleUploadTitlePic
		          	: this.handleUploadProfilePic
		          } color="primary">
		              Upload
		            </Button>
		        </DialogActions>
		      </Dialog>
			)
	}
}




export default UploadPicContentDialog;