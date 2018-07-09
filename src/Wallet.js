import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

var QRCode = require('qrcode.react');


class Wallet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showsSendDialog: false,
		};
	}


	sendTokens() {
		this.setState({
			showsSendDialog: true
		})
	}

	handleClose() {
		this.setState({
			showsSendDialog: false
		});
	}

	render() {
		return (
			<Card style={{maxWidth:'500px', minWidth:'300px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
				<CardContent>
					<center>
						<Typography style={{marginTop:'20px', marginBottom: '5px', fontSize: '15px'}} color="textSecondary">
			            	Balance
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '5px',fontSize: '30px', fontFamily: 'monospace'}} color="textPrimary">
			            	1 OASYS
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '10px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	1 USD
				        </Typography>
				        <QRCode value="0000-0000-0000-0000" />
				        <Typography style={{marginTop:'7px', marginBottom: '5px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	0000-0000-0000-0000
				        </Typography>
					</center>
				</CardContent>

				
				<CardActions style={{marginTop:'5px', textAlign: "center"}}>
					<Button variant="raised" color="primary" onClick={this.sendTokens.bind(this)} >
						Send
					</Button>
				</CardActions>
				

		        <Dialog
		          open={this.state.showsSendDialog}
		          onClose={this.handleClose.bind(this)}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">Sending OASYS Tokens</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Enter the Oasys Wallet Address of the receiver to send them OASYS tokens.
		            </DialogContentText>
		            <TextField
		              label="OASYS Address"
		              style={{width:'100%'}} 
		            />
		            <TextField
		              label="Amount"
		              style={{width:'100%'}} 
		              type="number"
		              autocomplete="number"
		              required step="0.000001"
		            />
		            <TextField
		              label="Password"
		              style={{width:'100%'}} 
		              type="password"
		              autocomplete="password-current"
		            />
		          </DialogContent>
		          <DialogActions>
		          	<Button onClick={this.handleClose.bind(this)} color="secondary">
		              Cancel
		            </Button>
		            <Button onClick={this.handleClose.bind(this)} color="primary">
		              Send
		            </Button>
		          </DialogActions>
		        </Dialog>

			</Card>
			)
	}
}

export default Wallet;
