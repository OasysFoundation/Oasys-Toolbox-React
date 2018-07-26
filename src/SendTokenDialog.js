import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


class SendTokenDialog extends Component {


	continueInMetamask() {

	}

	didChangeAmount(event) {

	}

	render() {
		return (
			<div>
				<Dialog open={this.props.open} onClose={this.props.onClose}>
        			<center style={{marginTop: '40px'}}>
                    	<MoneyIcon color="secondary" style={{fontSize: '100px'}}/>
                    </center>
                    <DialogTitle id="simple-dialog-title">Send OAS tokens to {this.props.recipientName}</DialogTitle>
                    <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Enter the amount of OAS tokens that you want to send to {this.props.recipientName}:
		            </DialogContentText>
                    <TextField
			          label="Amount"
			          onChange={this.didChangeAmount.bind(this)}
			          margin="normal"
			          style={{width:'100%'}}
			        />
		            <br />
		            <center style={{marginTop:'20px'}}>
			          <Button style={{marginLeft:'20px'}} variant="secondary" color="secondary" onClick={this.props.onClose}>
				        Cancel
				      </Button>
	                  <Button variant="raised" color="secondary" onClick={this.continueInMetamask.bind(this)}>
				        Continue in Metamask…
				      </Button>
				     </center>
		          </DialogContent>
        		</Dialog>
			</div>
			);
	}
}

export default SendTokenDialog;