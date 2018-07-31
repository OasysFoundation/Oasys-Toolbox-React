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
import { firebase } from './firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Plyr from 'react-plyr';
import blockchain from './blockchain'
const thousands = require('thousands');



var QRCode = require('qrcode.react');


class Wallet extends Component {
	constructor(props) {
		super(props);
		console.log(window.web3);
		this.state = {
			showsSendDialog: false,
			showsDepositDialog: false,
			tokenBalance: null,
			tokenDecimals: null,
			tokenName: null,
			tokenSymbol: null,
			userAddress: null,
		};

		if (blockchain.hasMetaMask()) {
			var that = this;
			blockchain.getBalanceForAddress("0x527CAe7D06376Aa7fd702043b80F30208542Df91")
			    .then(function(result) {
			    that.setState({
			    	tokenBalance: result
			    });
			});

			blockchain.getDecimals()
				.then(function(result) {
			    that.setState({
			    	tokenDecimals: result
			    });
			});

			blockchain.getCurrencyName()
			    .then(function(result) {
			    that.setState({
			    	tokenName: result
			    });
			});

			blockchain.getCurrencySymbol()
			    .then(function(result) {
			    that.setState({
			    	tokenSymbol: result
			    });
			});

			blockchain.getLocalUserAddress()
			.then(function(result) {
				that.setState({
			    	userAddress: result
			    });
			})

			blockchain.getTotalSupply().then(function(result) {
				console.log(result);
			})
		}


		firebase.auth.onAuthStateChanged(authUser => {
            this.setState({
            	userID: authUser.uid
            })
        });
	}


	showSendTokensDialog() {
		this.setState({
			showsSendDialog: true
		})
	}

	makeDeposit() {
		this.setState({
			showsDepositDialog: true
		})
	}

	handleClose() {
		this.setState({
			showsSendDialog: false,
			showsDepositDialog: false
		});
	}

	sendTokens() {
		console.log("I want to send");
		blockchain.sendToken(this.state.userAddress, "0x527cae7d06376aa7fd702043b80f30208542df92", 1000000000000000000);
	}

	onChangeRecipientAddress(event) {
		this.setState({
			recipientAddress: event.target.value
		});
	}

	onChangeSendingAmount(event) {
		this.setState({
			sendingAmount: event.target.value
		});
	}

	render() {
		let qrCode = <CircularProgress style={{ color: 'orange' }} thickness={7} />
		if (this.state.userAddress) {
            qrCode = <QRCode value={this.state.userAddress} />
        }

        if (!blockchain.hasMetaMask()) {
        	return (
        		<Card style={{maxWidth:'500px', minWidth:'300px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
				<CardContent>
					<div>
	        		Failed to connect to MetaMask. Please install MetaMask and Login – then refresh this wallet page.
	        		This video can help you in case you have never used MetaMask before:
					</div>
				    <Plyr
				      type="youtube"
				      videoId="2YeyTF5lalE"
				      style={{marginTop: '44px'}}
				    />
				</CardContent>
				</Card>
        		)
        }

        if (!(this.state.tokenBalance && this.state.tokenSymbol && this.state.tokenName && this.state.tokenDecimals && this.state.userAddress)) {
        	return (
        		<Card style={{maxWidth:'500px', minWidth:'300px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
				<CardContent>
	        		Connecting to Test Ethereum Network (Ropsten)…
					<LinearProgress style={{marginTop: '20px'}}/>
				</CardContent>
				</Card>
        		)
        }
		
		return (
			<div>
			<Card style={{maxWidth:'500px', minWidth:'300px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
				<CardContent>
					<center>
						<Typography style={{marginTop:'20px', marginBottom: '5px', fontSize: '15px'}} color="textSecondary">
			            	Balance
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '5px',fontSize: '30px', fontFamily: 'monospace'}} color="textPrimary">
			            	{thousands(this.state.tokenBalance / Math.pow(10, this.state.tokenDecimals))} {this.state.tokenSymbol}
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '10px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	0.0 USD
				        </Typography>
				        {qrCode}
				        <Typography style={{marginTop:'7px', marginBottom: '5px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	{this.state.userAddress}
				        </Typography>
					</center>
				</CardContent>

				
				<CardActions style={{marginTop:'5px', textAlign: "center"}}>
					<Button variant="raised" color="primary" onClick={this.showSendTokensDialog.bind(this)} >
						Send
					</Button>
					<Button variant="raised" color="primary" onClick={this.makeDeposit.bind(this)} >
						Make Deposit
					</Button>
				</CardActions>
				

		        <Dialog
		          open={this.state.showsSendDialog}
		          onClose={this.handleClose.bind(this)}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">Sending OAS Tokens</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Enter the Oasys Wallet Address of the receiver to send them OASYS tokens. Estimated Gas fee: 0.00125 OAS
		            </DialogContentText>
		            <TextField
		              label="OAS Address"
		              style={{width:'100%'}} 
		              onChange={this.onChangeRecipientAddress.bind(this)}
		            />
		            <TextField
		              label="Amount"
		              style={{width:'100%'}} 
		              type="number"
		              autocomplete="number"
		              required step="0.000001"
		              onChange={this.onChangeSendingAmount.bind(this)}
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
		            <Button onClick={this.sendTokens.bind(this)} color="primary">
		              Send
		            </Button>
		          </DialogActions>
		        </Dialog>



		        <Dialog
		          open={this.state.showsDepositDialog}
		          onClose={this.handleClose.bind(this)}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">Deposit ETH to your Oasys Wallet</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              You need to install MetaMask to use this feature. https://metamask.io.
		              Or: use this address to deposit ETH from your personal wallet to Oasys. ETH will be converted directly to Oasys Tokens.
		            </DialogContentText>
		            <TextField
		              style={{width:'100%'}} 
		              value="0xE6B653141C0BD1913A973e915BE1D1b1E9372aD8"
		            />
		          </DialogContent>
		          <DialogActions>
		          	<Button onClick={this.handleClose.bind(this)} color="secondary">
		              Close
		            </Button>
		          </DialogActions>
		        </Dialog>

			</Card>
			</div>
			)
	}
}

export default Wallet;
