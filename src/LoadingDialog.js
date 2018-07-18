import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';

class LoadingDialog extends Component {

	render() {
		return (
			<div>
				<Dialog open={this.props.open}>
        			<DialogTitle id="simple-dialog-title">{this.props.message}</DialogTitle>
        			<LinearProgress />
        		</Dialog>
			</div>
			);
	}
}

export default LoadingDialog;