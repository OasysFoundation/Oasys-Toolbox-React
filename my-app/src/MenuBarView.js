import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FolderIcon from '@material-ui/icons/Folder';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
//import Grid from '@material-ui/core/Grid';

const BG = "CadetBlue";

class MenuBarView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.contentId = 0;
  }

  onSave(){
    this.props.onSave(this.contentId, false);
  }

  onPublish(){
    this.props.onSave(this.contentId, true);
  }

  onLoad(){
    this.props.onLoad(this.contentId);
  }

  onChange(event) { 
    this.contentId = event.target.value;
  }

  render() {
    return (
    	<div>
      <Toolbar style={{backgroundColor: BG}}>
      <Button color="inherit" onClick={this.onLoad}>
          <FolderIcon />
          Open
      </Button>
    	<Button color="inherit" onClick={this.onSave}>
        <SaveIcon />
	        Save Draft
	      </Button>
      <Button  color="inherit" onClick={this.onPublish}>
        <SaveIcon />
          Publish on Oasys
        </Button>
        </Toolbar>
	    </div>
	)
  }
}


export default MenuBarView;
