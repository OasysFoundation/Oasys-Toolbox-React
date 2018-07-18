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
const thousands = require('thousands');

var Web3 = require('web3');
var abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/C2D8VJd9N6bPvd9mP60M"));
var OASContract = new web3.eth.Contract(abi, '0x559623d3660bbae4ee3c90c6ad600d54a520b792', {
    from: '0x527CAe7D06376Aa7fd702043b80F30208542Df91', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});




var QRCode = require('qrcode.react');


class Wallet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showsSendDialog: false,
			showsDepositDialog: false,
			tokenBalance: null,
			tokenDecimals: null,
			tokenName: null,
			tokenSymbol: null,
			userAddress: '0x527CAe7D06376Aa7fd702043b80F30208542Df91'
		};

		var that = this;
		OASContract.methods.balanceOf('0x527CAe7D06376Aa7fd702043b80F30208542Df91').call()
		    .then(function(result){
		    console.log("token balance: " + result);
		    that.setState({
		    	tokenBalance: result
		    });
		});

		OASContract.methods.decimals().call()
		    .then(function(result){
		    console.log("decimals: " + result);
		    that.setState({
		    	tokenDecimals: result
		    });
		});

		OASContract.methods.name().call()
		    .then(function(result){
		    console.log("name: " + result);
		    that.setState({
		    	tokenName: result
		    });
		});

		OASContract.methods.symbol().call()
		    .then(function(result){
		    console.log("symbol: " + result);
		    that.setState({
		    	tokenSymbol: result
		    });
		});


		firebase.auth.onAuthStateChanged(authUser => {
            this.setState({
            	userID: authUser.uid
            })
        });
	}


	sendTokens() {
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

	render() {
		let qrCode = <CircularProgress style={{ color: 'orange' }} thickness={7} />
		if (this.state.userAddress) {
            qrCode = <QRCode value={this.state.userAddress} />
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
					<Button variant="raised" color="primary" onClick={this.sendTokens.bind(this)} >
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
		          <DialogTitle id="alert-dialog-title">Sending OASYS Tokens</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Enter the Oasys Wallet Address of the receiver to send them OASYS tokens. Estimated Gas fee: 0.00125 ETH
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
