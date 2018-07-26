import {Component} from 'react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import logo from './logo.jpg'
import UploadPicContentDialog from './UploadPicContentDialog'
//import Name from './Name'
//import Snackbar from '@material-ui/core/Snackbar';

import {withRouter} from 'react-router-dom';
import UserProjects from './UserProjects'

class UserMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showsOpenDialog: false,
            imageURL: '',
            userName: '',
            snackBarMessage: null,

        }
        const profile = 'https://api.joinoasys.org/profile/' + this.props.authUser.uid
        fetch(profile, {
            method: 'GET',
            ContentType: "application/json"
        }).then(response => {
            console.log(response)
            return response.json().then(body => {
                console.log("body: " + body);
                if (body && body.length>0) {
                    this.setState({imageURL: body[0].PIC});
                } else {
                    this.setState({imageURL: logo});
                }
            })
        })
    }

    resetPw = () => {
        const {
            history,
        } = this.props;

        history.push('/resetPassword');
    }

    closeOpenDialog(photo) {
        this.setState({
            showsOpenDialog: false,
        });
    }

    onUpload() {
        this.setState({
            showsOpenDialog: true,
        });
    }

    closeSnackBar() {
        this.setState({
          snackBarMessage: null
        });
    }

    updateSnackbar(message) {
        this.setState({
          snackBarMessage: message,
        });
    }

    sendPic() {

        const profile = 'https://api.joinoasys.org/profile/' + this.props.authUser.uid 
        fetch(profile, {
            method: 'GET',
        }).then((response) => {
            response.json().then((body) => {
                console.log(body);
                if (body)
                    this.setState({imageURL: body[0].PIC});
                else {
                    this.setState({imageURL: logo});
                }
            });
        });
    }

    render() {
        return (
            <center>
                <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign: 'left'}} elevation={4}>
                    <center>
                        {this.state.imageURL
                            ? <img src={this.state.imageURL} style={{maxWidth: '100px', marginBottom: '16px'}} alt=""/>
                            : null
                        }
                    </center>
                    <Typography variant="headline" component="h3" style={{marginBottom: '16px'}}>
                        <IconAccountCircle/> Welcome {
                        this.props.authUser
                            ? this.props.authUser.displayName
                            : ""
                    }
                    </Typography>
                    <Typography component="p">
                        You can see all your created content here!
                    </Typography>

                    <div style={{marginTop: '16px'}}>
                        <Button color="primary" onClick={this.resetPw.bind(this)} style={{margin:'10px'}}>
                            Change Password
                        </Button>
                        <Button color="primary" onClick={this.onUpload.bind(this)} style={{margin:'10px'}}>
                            Upload Picture
                        </Button>
                        <UploadPicContentDialog pic={this.sendPic.bind(this)} authUser={this.props.authUser}
                                                open={this.state.showsOpenDialog}
                                                onClose={this.closeOpenDialog.bind(this)}
                                                snackBarControl={this.updateSnackbar.bind(this)}/>
                        <Button color="primary" onClick={function (event) {
                            event.preventDefault();
                            window.location.href = '../wallet/'
                        }} style={{margin:'10px'}}>
                            My Wallet
                        </Button>
                        <br/>
                    </div>
                </Paper>
                <UserProjects userId={this.props.authUser.displayName}/>
            </center>
        )
    }
}


export default withRouter(UserMainPage);