import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FolderIcon from '@material-ui/icons/Folder';
import TextField from '@material-ui/core/TextField';
//import Grid from '@material-ui/core/Grid';

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
      <Button variant="raised" onClick={this.onPublish}>
          <SaveIcon />
          Publish
        </Button>
    	<Button variant="raised" onClick={this.onSave}>
	        <SaveIcon />
	        Save
	      </Button>
    	
          <TextField
            id="name"
            label="Content Identifier"
            margin="normal"
            onChange={this.onChange} />
	      <Button variant="raised" onClick={this.onLoad}>
	        <FolderIcon />
	        Open
	      </Button>
	    </div>
	)
  }
}


export default MenuBarView;
