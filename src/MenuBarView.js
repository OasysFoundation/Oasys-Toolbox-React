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
        }
  }

  onSave() {
    notify.show('Saved Draft');
    this.props.onSave(this.contentId, false);
  }

  onPublish() {
    notify.show('Publishing…');
    this.props.onSave(this.contentId, true);
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
    this.props.onLoad(this.contentId);
    this.handleClose()
  }

  onChange(event) { 
    this.contentId = event.target.value;
  }

  onClosePopup() {
    
  };

  render() {
    return (
    	<div>
      <Notifications />
      <Toolbar style={{backgroundColor: BG}}>
      <Button onClick={this.onOpen} color="white">
        <FolderIcon />
          Open
      </Button>
      <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.onClosePopup}
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
                  onClose={this.handleClose}
                >
                <IconArrowForward />
                </IconButton>
              </InputAdornment>
            }
        />

      </Popover>
    	<Button onClick={this.onSave} color="white">
        <SaveIcon />
	        Save Draft
	    </Button>
      <Button  onClick={this.onPublish} color="red">
        <PublishIcon />
          Publish on Oasys
        </Button>
      </Toolbar>
	    </div>
	)
  }
}


export default MenuBarView;
