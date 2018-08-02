import React, {Component} from 'react';
import {Button, Comment, Form, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import OrganizeComments from './OrganizeComments'
import {buttonGradientCSS} from "./stylings";
import { Unwrap } from './utils';
import api from './tools'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


var decode = require('urldecode')



class CommentSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            comment: '',
            reply: '',
            hideReply: false,
            currentReply: '',
            finalComments: [],
            slideLength: this.props.slideLength,
            snackBarMessage:  "",
            showSnackBar: false,

        }
        this.slideNumber = "end";

        if ((typeof(this.props.slideNumber) === "number") && ((this.props.slideNumber) === this.props.slideLength))
            this.slideNumber = "end"
        else if (this.props.slideNumber){
            this.slideNumber = this.props.slideNumber;
        }

        let that = this;
        let userName = null;
        let contentName = null;
        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            userName = Unwrap(directory[0]);
            contentName = Unwrap(directory[1]);
        } else {
            contentName = Unwrap(this.props.match.params.contentId);
            userName = Unwrap(this.props.match.params.userName);
        }
        
        api.getCommentsForContent(userName, contentName, this.slideNumber).then(json => {
            that.setState({comments:json})
        })



       
    }

    closeSnackBar() {
        this.setState({
          snackBarMessage: "",
          showSnackBar: false,
        });
    }

    onSubmitReply = (e, id) => {

        let parent = e;
        let contentName = '';
        let userName='';
        let authUser = this.props.name;


        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = Unwrap(directory[1]);
            userName = Unwrap(directory[0]);
        }
        else {
            contentName = Unwrap(this.props.match.params.contentId);
            userName = Unwrap(this.props.match.params.userId);
        }

        let accessUser;
        authUser ?
            accessUser = authUser.displayName
            : accessUser = null;

        var currentTime = Date.now();
        if (typeof(this.slideNumber) === "number")
            this.slideNumber = this.slideNumber.toString()
        if(!accessUser)
            accessUser = "Anonymous"
        var data = {
            "time": currentTime,
            "comment": this.state.currentReply,
            "parent": parent,
            "slideNumber": this.slideNumber,
            "accessUser" : accessUser,
            "accessUserUID": authUser.uid,
            "contentName": contentName,
            "contentUserName": userName,
        }
        var that = this;


        if(authUser && authUser.displayName){

            authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                api.postComment(data, idToken).then(json => {
                    that.setState({
                        currentReply: ''
                    });
                    that.handleChange();
                    })
                .catch(function(error) {
                  console.log(error);
                  that.setState({
                    snackBarMessage: 'Error Posting Comment. If this continues, please contact info@joinoasys.org',
                    showSnackBar: true,
                  })
                });
            }).catch(function(error) {
              console.log(error);
            });
        }
        else{
            api.postComment(data, "").then(json => {
                    this.setState({
                        currentReply: ''
                    });
                    this.handleChange();
                    })
            .catch(function(error) {
                  console.log(error);
                  that.setState({
                    snackBarMessage: 'Error Posting Comment. If this continues, please contact info@joinoasys.org',
                    showSnackBar: true,
                  })
                });
        }
    }

    onSubmit = (e) => {

        var contentName = '';
        var userName='';
        let authUser = this.props.name;

        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = Unwrap(directory[1]);
            userName = Unwrap(directory[0]);
        }
        else {
            contentName = Unwrap(this.props.match.params.contentId);
            userName = Unwrap(this.props.match.params.userId);
        }


        let accessUser;
        authUser ?
            accessUser = authUser.displayName
            : accessUser = null;

        var currentTime = Date.now();
        if (typeof(this.slideNumber) === "number")
            this.slideNumber = this.slideNumber.toString()
        if(!accessUser)
            accessUser="Anonymous"
        var data = {
            "time": currentTime,
            "comment": this.state.comment,
            "slideNumber": this.slideNumber,
            "accessUser": accessUser,
            "accessUserUID": authUser.uid,
            "contentName": contentName,
            "contentUserName": userName,
        }
            var that = this;

       if(authUser && authUser.displayName){
            authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                api.postComment(data, idToken).then(json => {
                    that.setState({
                        comment: ''
                    });
                    that.handleChange();
                    })
                .catch(function(error) {
                  console.log(error);
                  that.setState({
                    snackBarMessage: 'Error Posting Comment. If this continues, please contact info@joinoasys.org',
                    showSnackBar: true,
                  })
                });
            }).catch(function(error) {
              console.log(error);
            });
        }
        else{
            api.postComment(data, "").then(json => {
                    this.setState({
                        currentReply: ''
                    });
                    this.handleChange();
                    })
            .catch(function(error) {
                  console.log(error);
                  that.setState({
                    snackBarMessage: 'Error Posting Comment. If this continues, please contact info@joinoasys.org',
                    showSnackBar:true,
                  })
                });
        }
    }

    addComment = (event) => {

        this.setState({
            comment: event.target.value
        })
    }

    addReply = (event) => {

        this.setState({
            currentReply: event.target.value
        })
    }

    someFunction(id) {
        this.setState({
            reply: id,
            hideReply: false,
        })

    }

    cancelReply(id) {
        this.setState({
            hideReply: true,
        })

    }

    myReply = (id) => {
        return (
            <div>
                <Comment.Actions>
                    <Button content='Reply' onClick={this.someFunction.bind(this, id)}/>
                </Comment.Actions>
                {this.state.reply === id
                    ? (
                         this.state.hideReply
                        ? null
                        : (
                            <Form reply>
                                <Form.TextArea value={this.state.currentReply} onChange={this.addReply.bind(this)}/>
                                <Button onClick={this.onSubmitReply.bind(this, id)} content='Add Reply' labelPosition='left'
                                        icon='edit' primary/>
                                <Button content='Cancel' labelPosition='left' onClick={this.cancelReply.bind(this, id)} />

                            </Form>
                        )
                    )
                    : (null)
                }

            </div>
        )
    }

    getContentInfo() {
        let userName = null;
        let contentName = null;
        if (!this.props.match || this.props.match===undefined) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = Unwrap(directory[1]);
            userName = Unwrap(directory[0]);
        } else {
            contentName = Unwrap(this.props.match.params.contentId);
            userName = Unwrap(this.props.match.params.userId);
        }
        return {userName: userName, contentName: contentName}
    }

    handleChange = () => {
        const info = this.getContentInfo();
        const that = this;
        const {userName, contentName} = info;

        api.getCommentsForContent(userName, contentName, this.slideNumber).then(json => {
            that.setState({comments:json})
        })
    }

    render() {
        const info = this.getContentInfo();

        return (
                <div style={{overflow: 'auto', maxHeight: 60+'vh', margin: '20px'}}>
                    <Comment.Group>
                        <Header as='h3' dividing>
                            Comments for "{decode(info.contentName)}" by {decode(info.userName)}
                        </Header>

                        <Form reply style={{marginBottom:'30px'}}>
                            <Form.TextArea value={this.state.comment} onChange={this.addComment.bind(this)}/>
                            {/*had to just add style bc CoolBlueButton doesn't have the same API as Button*/}
                            <Button style={buttonGradientCSS.blue} onClick={this.onSubmit.bind()} content='Add Comment' labelPosition='left' icon='edit'
                                    primary/>
                        </Form>

                        {this.state.comments.length === 0 ?
                            (null)
                            : (
                                <OrganizeComments comments={this.state.comments} reply={this.myReply.bind(this)}/>
                            )
                        }

                        
                    </Comment.Group>
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      open={this.state.showSnackBar}
                      autoHideDuration={6000}
                      onClose={this.closeSnackBar.bind(this)}
                      ContentProps={{
                        'aria-describedby': 'message-id',
                      }}
                      message={<span id="message-id">{this.state.snackBarMessage}</span>}
                      action={[
                        <IconButton
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          onClick={this.closeSnackBar.bind(this)}
                        >
                          <CloseIcon />
                        </IconButton>,
                      ]}
                    />
                </div>
        )
    }
}

export default CommentSection;