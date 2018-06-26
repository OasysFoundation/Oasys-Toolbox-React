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
import Notifications, {notify} from 'react-notify-toast';
import OpenProjectDialog from './OpenProjectDialog'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input'
//import Grid from '@material-ui/core/Grid';

const BG = "#5C8B8E";



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
    this.onLoad = this.onLoad.bind(this);
    this.contentId = 0;
    this.onOpen = this.onOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
            anchorEl: null,
            showsSaveDialog: false,
            saveAction: null
        }

    this.show = notify.createShowQueue();
  }

  onSave() {
    this.setState({
      saveAction: 'save',
      showsSaveDialog: true
    });

  }

  onPublish() {
    this.setState({
      saveAction: 'publish',
      showsSaveDialog: true
    });
  }

  onSubmit() {
    if (this.state.saveAction == 'save') {
      this.show('Saved Draft');
      this.props.onSave(this.contentId, false, this.state.title, this.state.username, this.state.hashtags, this.state.pictureURL, this.state.description);
    }
    if (this.state.saveAction == 'publish') {
      this.show('Publishing…');
      this.props.onSave(this.contentId, true, this.state.title, this.state.username, this.state.hashtags, this.state.pictureURL, this.state.description);
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

  onLoad() {
    this.show('Opening…');
    this.props.onLoad(this.contentId);
    this.handleClose()
  }

  onChange(event) { 
    this.contentId = event.target.value;
  }

  onClosePopup() {
    this.setState({
      anchorEl: null,
    });
  };

  closeSaveDialog() {
    this.setState({
      showsSaveDialog: false
    });
  }

  render() {
    return (
    	<div>
      <Notifications />
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
          placeholder="Content ID (Link)"
          inputProps={{
            'aria-label': 'Description',
          }}
          endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Open Content"
                  onClick={this.onLoad}
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
        <DialogTitle id="alert-dialog-title">{"Oasys Quiz Editor"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is a beta user interface. Most of these fields will be embedded into the editor in future. For now we need these values otherwise the server would reject our save request.
          </DialogContentText>
            <TextField
              id="name"
              placeholder="Content Title"
              style={{width:'100%'}} 
              value={this.props.contentTitle} 
              onChange={this.onChange}
              margin="normal"
            />
            <TextField
              id="name"
              placeholder="Username"
              style={{width:'100%'}} 
              value={this.props.username} 
              onChange={this.onChange}
              margin="normal"
            />
            <TextField
              id="name"
              placeholder="Picture URL"
              style={{width:'100%'}} 
              value={this.props.pictureURL} 
              onChange={this.onChange}
              margin="normal"
            />
            <TextField
              id="name"
              placeholder="Description"
              style={{width:'100%'}} 
              value={this.props.description} 
              onChange={this.onChange}
              margin="normal"
            />
            <ChipInput
              placeholder="Hashtags"
              style={{width:'100%'}} 
              value={this.props.hashtags} 
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

	    </div>
	)
  }
}


export default MenuBarView;
