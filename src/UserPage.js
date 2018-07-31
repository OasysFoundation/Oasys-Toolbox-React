import React from 'react';
import {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import UserPublicProjects from './UserPublicProjects';
import api from './tools'
import SendTokenDialog from './SendTokenDialog'

var QRCode = require('qrcode.react');




class UserPage extends Component {
    constructor(props) {
        super(props);

        const username = props.match.params.username.toLowerCase();
        this.state = {
            userAddress: null,
            userName: username,
            showsSendTokensDialog: false
        }

        const that = this;
        api.getWalletIdForUser(username).then(function(result) {
            console.log(result);
            that.setState({
                userAddress: result[0].walletId
            });
        })
    }

    showSendTokensDialog() {
        this.setState({
            showsSendTokensDialog: true
        })
    }

    closeTokenDialog() {
        this.setState({
            showsSendTokensDialog: false
        })
    }

    render() {
        let qrCode = <CircularProgress style={{ color: 'orange' }} thickness={7} />
        if (this.state.userAddress) {
            qrCode = <QRCode value={this.state.userAddress} />
        }

        return (
            <div>
            <center>
                <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign: 'left'}} elevation={4}>
                    <center>
                    <Typography variant="headline" component="h3" style={{marginBottom: '16px', marginTop: '16px'}}>
                        This is <i>{ this.state.userName }</i>.
                    </Typography>
                    </center>
                    <center>
                        {qrCode}
                    </center>
                    <Typography style={{marginTop:'7px', marginBottom: '5px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
                            {this.state.userAddress}
                    </Typography>
                    <CardActions style={{marginTop:'5px', textAlign: "center"}}>
                        <Button variant="raised" color="primary" onClick={this.showSendTokensDialog.bind(this)} >
                            Send OAS to { this.state.userName }
                        </Button>
                    </CardActions>
                </Paper>

                <UserPublicProjects userId={this.state.userName}/>

            </center>
            <SendTokenDialog open={this.state.showsSendTokensDialog} onClose={this.closeTokenDialog.bind(this)} recipientName={this.state.userName}/>
            </div>
            )
    }
}


export default UserPage;