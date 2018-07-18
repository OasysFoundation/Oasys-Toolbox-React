import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';

class UploadingDialog extends Component {

	render() {
		return (
			<div>
				<Dialog open={this.props.open}>
        			<DialogTitle id="simple-dialog-title">Uploading Content…</DialogTitle>
        			<LinearProgress />
        		</Dialog>
			</div>
			);
	}
}

export default UploadingDialog;