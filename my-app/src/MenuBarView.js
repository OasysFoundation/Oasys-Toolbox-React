import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FolderIcon from '@material-ui/icons/Folder';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class MenuBarView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    	// these buttons should trigger the load / save functions (probably no VIEW components, but only functions)
    	<div>
    	<Button variant="raised">
	        <SaveIcon />
	        Save
	      </Button>
    	
            <TextField
          id="name"
          label="Content Identifier"
          value=""
          margin="normal" />
	      <Button variant="raised">
	        <FolderIcon />
	        Load
	      </Button>
	    </div>
	)
  }
}


export default MenuBarView;
