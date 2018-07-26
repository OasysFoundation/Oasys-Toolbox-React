import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import FolderIcon from '@material-ui/icons/Folder';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
//import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';

import OpenContentDialog from '../OpenContentDialog';
import UploadPicContentDialog from '../UploadPicContentDialog'
import logo from '../logo.jpg'
import LoadingDialog from '../LoadingDialog'
import PublishedCheerDialog from '../PublishedCheerDialog'
import AlreadyPublishedDialog from '../AlreadyPublishedDialog'
import {Wrap} from "../Unwrap"


const BG = "#00897b";

const buttonStyle = {
  padding: '0',
}


class MenuBarView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    // this.postInteractionData = this.postInteractionData.bind(this);
    this.contentId = 0;
    this.onOpen = this.onOpen.bind(this);

    this.state = {
            showsSaveDialog: false,
            saveAction: null,
            link: null,
            slides: this.props.slides,
            snackBarMessage: null,
            showsOpenDialog: false,
            showsUploadPicDialog: false,
            pictureURL: '',
            hashtags:this.props.hashtags,
            description:this.props.description,
            loading:false,
            isUploading: false,
            showsConclusionDialog: false,
            publishedSubmitted: false,
            publishAck:true,
      };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hashtags:nextProps.hashtags,
      description:nextProps.description
    });
  }

  onSave() {
    this.setState({
      saveAction: 'save',
      showsSaveDialog: true,
    });
  }

  onPublish() {
    this.setState({
      saveAction: 'publish',
      showsSaveDialog: true
    });
  }


  prepareSlides(slides, oncomplete) {
    
    let imagesToSave = [];
    let m;
    const findImageTagsRegEx = /<img src="?([^"\s]+)"(.*?)>/g;
    slides.forEach(function(slide) {
      if (slide.type === 0) {
        //quill content

        // eslint-disable-next-line no-cond-assign
        while ( m = findImageTagsRegEx.exec( unescape(slide.content) ) ) {
            let found = m[1];
            if (!found.includes("http")) {
              imagesToSave.push(found);
            }
        }
      }
    });

    // eslint-disable-next-line array-callback-return
    slides.map(function(slide) {
      slide.thumb = null;
    });

    if (imagesToSave.length === 0) {
      //this.sendToServer(contentId, published, hashtags, description, slides);
      oncomplete(slides);
      return;
    }

    var semaphore = 0;
    imagesToSave.forEach(function(base64Image) {
    semaphore++;
      const spacesEndpoint = 'https://api.imgur.com/3/image'

      let newBase64Image = base64Image.split(",")[1];

      
      fetch(spacesEndpoint, {
        method: 'POST',
        body: newBase64Image,
        headers: new Headers({
         'Authorization': 'Client-ID dab43e1ba5b9c27',
         'Accept': 'application/json'
        }),
      }).then((response) => {
        response.json()
        .catch(error => {
        console.error('Error:', error);
      }).then((body) => {
          console.log(body);
          if (body) {
            console.log('IMGUR LINK: ' + body.data.link);

            // eslint-disable-next-line array-callback-return
            slides.map(function(slide) {
              if (slide.type === 0) {
                //quill content
                slide.content = slide.content.replace(base64Image, body.data.link);
              }
            });

            semaphore--;

            if (semaphore === 0) {
              oncomplete(slides);
            }

          }
        });
      });
    });    
  }

  performFetch(saveEndpoint,data){
      fetch(saveEndpoint, {
        method: 'POST', 
        body: JSON.stringify(data),
        headers: new Headers({
         'Content-Type': 'application/json',
       })
      }).then(res => res.json())
      .catch(error => {
        console.error('Error:', error);
        this.setState({
            snackBarMessage: 'Error Saving. If this continues, please contact info@joinoasys.org',
            isUploading: false
        })
      })
      .then(response => {
        this.setState({
          showsSaveDialog: false
        });

        console.log(response);

        if (response) {
          if(response.alreadyPublished){
            this.setState({
              snackBarMessage: 'Content already published, please change title and try again.',
              isUploading: false
            })
          }
          else if(response.hyphen){
            this.setState({
                snackBarMessage: 'You cannot include hyphens in title. Please try again.',
                isUploading: false
            })
          }
          else if(response.notVerified){
            this.setState({
                snackBarMessage: 'We ran into a problem. Please re-sign-in and try again.',
                isUploading: false
            })
          }
          else if (this.state.saveAction === 'save') {
            this.setState({
              snackBarMessage: 'Saved Draft',
              isUploading: false
            })
          }

          else if (this.state.saveAction === 'publish') {
            this.setState({
              snackBarMessage: 'Published',
              isUploading: false,
              showsConclusionDialog: true,
              publishedSubmitted: true,
            })
          }
        }
        });
  }

  sendToServer(contentId, published, hashtags, description, slides) {
    var username = this.props.authUser.displayName;
    if(!username)
      username= "Anonymous"
    var saveEndpoint = 'https://api.joinoasys.org/save/'+username+'/'+contentId;
    var data = {
      "data":slides,
      "published":published,
      "title":contentId,
      "description":description,
      "tags":hashtags,
    }

    console.log(data);
    if(this.props.authUser && this.props.authUser.displayName){
        var that = this;
        this.props.authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          saveEndpoint= saveEndpoint+ '/' + idToken
          that.performFetch(saveEndpoint,data);
        }).catch(function(error) {
          console.log(error);
        });
     }
     else{
        saveEndpoint= saveEndpoint+ '/noToken' 
        this.performFetch(saveEndpoint,data)
     }
  }

  onSubmit() {
    this.setState({
      isUploading: true
    });
    var that = this;
    this.prepareSlides(this.props.slides, function(slides) {
      if (that.state.saveAction === 'save') {
        that.sendToServer(that.props.contentTitle, 0, that.state.hashtags, that.state.description, slides);
      }
      if (that.state.saveAction === 'publish') {
        that.sendToServer(that.props.contentTitle, 1, that.state.hashtags, that.state.description, slides);
      }
    });
  }

  onOpen(event) {


    this.setState({
      showsOpenDialog: true,
    });
  }

  onLoad(event) {
    this.setState({
        snackBarMessage: 'Opening…'
      })
    var loadContent = this.state.link;
    loadContent = loadContent.replace("app.joinoasys.org", "api.joinoasys.org");

    console.log(loadContent);
    var that = this;

    fetch(loadContent, {
      method: 'GET'
    }).then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        that.setState({
          slides:myJson[0]
        })
      });


    this.handleClose();


  }

  onChange(event) { 
    switch (event.target.id){
      case "title": 
        this.setState({
          title: event.target.value,
        });
        break;
      case "pictureURL": 
        this.setState({
          pictureURL: event.target.value,
        });
        break;
      case "description": 
        this.setState({
          description: event.target.value,
        });
        break;
      case "hashtags": 
        this.setState({
          hashtags: event.target.value,
        });
        break;
      default:

    }
  }


  handleLoadChange(event) {
    this.setState({
      link: event.target.value
    })
  }

  closeSaveDialog() {
    this.setState({
      showsSaveDialog: false
    });
  }

  closeSnackBar() {
    this.setState({
      snackBarMessage: null
    });
  }

  closeOpenDialog(selectedContent) {
    if(selectedContent){
      console.log(selectedContent);
      const link = "https://app.joinoasys.org/user/"+selectedContent.userId+"/"+selectedContent.contentId;
      this.setState({
        showsOpenDialog: false,
        link: link
      });
      this.props.onLoad("user/"+selectedContent.userId+"/"+selectedContent.contentId);
    }
    else{
      this.setState({
        showsOpenDialog:false,
      })
    }
  }

  updateURL(){
    var username=this.props.authUser.displayName;
    if(!username)
      username= "Anonymous"

    const allData = 'https://api.joinoasys.org/user/'+username+'/'+this.props.contentTitle
    console.log(allData);
    fetch(allData, {
      method: 'GET',
    }).then((response) => {
      console.log(response);
        response.json().then((body) => {
          console.log(body);
          if(body)
            this.setState({ pictureURL: body[0].picture });
          else{
            this.setState({ pictureURL: logo });
          }
       });
        });
  }

  onUpload() {
      this.setState({
        showsUploadPicDialog: true,
      });
    }

  closeUploadDialog() {
    this.setState({
      showsUploadPicDialog: false,
    });
  }

  updateSnackbar(message) {
    this.setState({
      snackBarMessage: message,
    });
  }

  closePublishedDialog() {
    this.setState({
      showsConclusionDialog: false
    })
  }

  closeAlreadyPublishedDialog() {
    this.setState({
      publishedSubmitted: false,
      publishAck: false,
    })
  }

  render() {
    const {
      description,
      hashtags
    } = this.state;
    const isInvalid = !description || !hashtags;

    const userName = ((this.props.authUser && this.props.authUser.displayName) ? this.props.authUser.displayName : "Anonymous");
    const shareableLink = "https://app.joinoasys.org/user/" + Wrap(userName) +'/'+ Wrap(this.props.contentTitle);

    var published = 0
    if(this.props.published==1 && this.state.publishAck)
      published = 1

    return (
    	<div>
      <AlreadyPublishedDialog open={this.state.publishedSubmitted || published} onClose={this.closeAlreadyPublishedDialog.bind(this)} changeTitle={this.props.changeTitle} oldTitle={this.props.contentTitle}/>
      <LoadingDialog open={this.state.isUploading} message='Uploading Content…' />
      <PublishedCheerDialog open={this.state.showsConclusionDialog} sharableLink={shareableLink} onClose={this.closePublishedDialog.bind(this)}/>
      <Toolbar style={{backgroundColor: BG, height: '40px', minHeight: '40px'}}>
        <Tooltip enterDelay={500} id="tooltip-bottom" title="Save content in your account but don't publish it yet. You can open drafts later again and continue editing." placement="bottom">
      	<Button onClick={this.onSave} style={{color: 'white'}} >
          <SaveIcon />
  	        Save Draft
  	    </Button>
        </Tooltip>

        <Tooltip enterDelay={500} id="tooltip-bottom" title="Publish your content on the Oasys platform. Other users then can explore, use, share, edit, comment, and remix your content." placement="bottom">
        <Button onClick={this.onPublish.bind(this)} style={{color: '#ffd54f'}} >
          <PublishIcon />
            Publish on Oasys
        </Button>
        </Tooltip>

      </Toolbar>

      <Dialog
        open={this.state.showsSaveDialog}
        onClose={this.closeSaveDialog.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >        

        <DialogTitle id="alert-dialog-title">{"Great Work!"}</DialogTitle>


        <DialogContent>
        {this.state.saveAction==="publish"
          ? (
            <DialogContentText id="alert-dialog-description">
              Once published, you cannot edit this content! Edits to this content will be saved as new content. 
            </DialogContentText>
            )
          :(
            <DialogContentText id="alert-dialog-description">
              Providing hashtags and a description helps us get your content to the right people! 
            </DialogContentText>
            )
        }

            <TextField
              id="description"
              placeholder="Description"
              style={{width:'100%'}} 
              value={this.state.description} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="hashtags"
              placeholder="Hashtags"
              style={{width:'100%'}} 
              value={this.state.hashtags}
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <br/>
            <br/>
            <Button style={buttonStyle} color="primary" onClick={this.onUpload.bind(this)}>
            Upload Cover Picture 
            </Button>
            <UploadPicContentDialog titleUpload={true} url={this.updateURL.bind(this)} authUser={this.props.authUser} contentId={this.props.contentTitle} open={this.state.showsUploadPicDialog} onClose={this.closeUploadDialog.bind(this)} snackBarControl={this.updateSnackbar.bind(this)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary">
            Cancel
          </Button>
          <Button disabled={isInvalid} onClick={this.onSubmit.bind(this)} color="primary" autoFocus>
          {
          this.props.authUser
          ? this.props.authUser.displayName
            ? "Submit as " + this.props.authUser.displayName
            : "Submit as Anonymous"
          : "Submit as Anonymous"
        }
          </Button>
        </DialogActions>
      </Dialog>



      <OpenContentDialog userId={
        this.props.authUser
        ?this.props.authUser.displayName
        :null
      }
      open={this.state.showsOpenDialog} onClose={this.closeOpenDialog.bind(this)}/>

      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackBarMessage}
          autoHideDuration={6000}
          onClose={this.closeSnackBar.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackBar.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

	    </div>
	)
  }
}


export default MenuBarView;
