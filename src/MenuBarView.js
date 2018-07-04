import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import FolderIcon from '@material-ui/icons/Folder';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import Popover from '@material-ui/core/Popover';
import OpenProjectDialog from './OpenProjectDialog'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input'
//import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';


const BG = "#5C8B8E";

//var username = "test";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class MenuBarView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.completeFetch = this.completeFetch.bind(this);
    this.contentId = 0;
    this.onOpen = this.onOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
            anchorEl: null,
            showsSaveDialog: false,
            saveAction: null,
            link: null,
            slides: this.props.slides,
            title: this.props.contentTitle,
            snackBarMessage: null
        }
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

  completeFetch(contentId, published, hashtags, pictureURL, description, slides) {
    var username = this.props.authUser.displayName;
    var saveEndpoint = 'https://api.joinoasys.org/'+username+'/'+contentId+'/save';
    var data = {
      "data":slides,
      "published":published,
      "picture":pictureURL,
      "title":contentId,
      "description":description,
      "tags":hashtags,
    }

    fetch(saveEndpoint, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: new Headers({
       'Content-Type': 'application/json',
     })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      this.setState({
        showsSaveDialog: false
      });

      });
  }

  onSubmit() {
    if (this.state.saveAction == 'save') {
      this.setState({
        snackBarMessage: 'Saved Draft'
      })
      this.completeFetch(this.state.title, 0, this.state.hashtags, this.state.pictureURL, this.state.description, this.props.slides);
    }
    if (this.state.saveAction == 'publish') {
      this.setState({
        snackBarMessage: 'Published'
      })
      this.completeFetch(this.state.title, 1, this.state.hashtags, this.state.pictureURL, this.state.description, this.props.slides);
    }
  }

  onOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  };

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

  onClosePopup() {
    this.setState({
      anchorEl: null,
    });
  };

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

  open() {
    this.props.onLoad(this.state.link);
  }

  closeSnackBar() {
    this.setState({
      snackBarMessage: null
    })
  }

  render() {
    return (
    	<div>
      <Toolbar style={{backgroundColor: BG}}>
      <Button onClick={this.onOpen} style={{color: 'white'}} >
        <FolderIcon />
          Open
      </Button>
      <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.onClosePopup.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          
        <Input
          placeholder="Link to Content"
          value={this.state.title}
          onChange={this.handleLoadChange.bind(this)}
          inputProps={{
            'aria-label': 'Description',
          }}
          endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Open Content"
                  onClick={this.open.bind(this)}
                  onClose={this.onClosePopup}
                >
                <IconArrowForward />
                </IconButton>
              </InputAdornment>
            }
        />

      </Popover>
    	<Button onClick={this.onSave} style={{color: 'white'}} >
        <SaveIcon />
	        Save Draft
	    </Button>
      <Button onClick={this.onPublish.bind(this)} style={{color: 'orange'}} >
        <PublishIcon />
          Publish on Oasys
        </Button>
      </Toolbar>

      <Dialog
        open={this.state.showsSaveDialog}
        onClose={this.closeSaveDialog.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >        

        <DialogTitle id="alert-dialog-title">{"You are almost done!"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We need a little more information to properly save your content. 
          </DialogContentText>
            <TextField
              id="title"
              placeholder="Title"
              style={{width:'100%'}} 
              value={this.props.contentTitle} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="pictureURL"
              placeholder="Picture URL"
              style={{width:'100%'}} 
              value={this.props.pictureURL} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="description"
              placeholder="Description"
              style={{width:'100%'}} 
              value={this.props.description} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="hashtags"
              placeholder="Hashtags"
              style={{width:'100%'}} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit.bind(this)} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>


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
