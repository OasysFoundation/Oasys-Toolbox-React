import React, {Component} from 'react';
import {Button, Comment, Form, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import OrganizeComments from './OrganizeComments'
import {buttonGradientCSS} from "./stylings";


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
        }
        this.slideNumber = '';

        if ((typeof(this.props.slideNumber) === "number") && ((this.props.slideNumber) === this.props.slideLength))
            this.slideNumber = "end"
        else
            this.slideNumber = this.props.slideNumber;

        let that = this;
        let userName = null;
        let contentName = null;
        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            userName = directory[0];
            contentName = directory[1];
        } else {
            contentName = this.props.match.params.contentId;
            userName = this.props.match.params.userName;
        }
        let loadComments = 'https://api.joinoasys.org/comment/'+userName+'/' + contentName + '/' + this.slideNumber;
        fetch(loadComments, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            that.setState({comments: myJson});

        });
       
    }

    onSubmitReply = (e, id) => {

        let parent = e;
        let contentName = '';
        let userName='';

        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = directory[1];
            userName = directory[0];
        }
        else {
            contentName = this.props.match.params.contentId;
            userName = this.props.match.params.userId;
        }

        var commentEndpoint = 'https://api.joinoasys.org/comment/' + userName + '/' + contentName;
        var currentTime = Date.now();
        if (typeof(this.slideNumber) === "number")
            this.slideNumber = this.slideNumber.toString()
        var data = {
            "time": currentTime,
            "comment": this.state.currentReply,
            "parent": parent,
            "slideNumber": this.slideNumber,
            "accessUser" : userName,
        }

        fetch(commentEndpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log("success");
                this.setState({
                    currentReply: ''
                });
                this.handleChange();

            });

        if (this.props.slideNumber === 'end') {
            window.location.replace('/')
        }
    }

    onSubmit = (e) => {

        var contentName = '';
        var userName='';

        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = directory[1];
            userName = directory[0];
        }
        else {
            contentName = this.props.match.params.contentId;
            userName = this.props.match.params.userId;
        }


        let accessUser;
        this.props.name ?
            accessUser = this.props.name.displayName
            : accessUser = null;

        var commentEndpoint = 'https://api.joinoasys.org/comment/' + userName + '/' + contentName;
        var currentTime = Date.now();
        if (typeof(this.slideNumber) === "number")
            this.slideNumber = this.slideNumber.toString()
        var data = {
            "time": currentTime,
            "comment": this.state.comment,
            "slideNumber": this.slideNumber,
            "accessUser": accessUser,
        }

        fetch(commentEndpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log("success");
                this.setState({
                    comment: ''
                });
                this.handleChange();

            });
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
            contentName = directory[1];
            userName = directory[0];
        } else {
            contentName = this.props.match.params.contentId;
            userName = this.props.match.params.userId;
        }
        return {userName: userName, contentName: contentName}
    }

    handleChange = () => {
        const info = this.getContentInfo();
        const loadComments = 'https://api.joinoasys.org/comment/'+info.userName+'/' + info.contentName + '/' + this.slideNumber;
        const that = this;
        fetch(loadComments, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                console.log(myJson);
                that.setState({comments: myJson});

        });
    }

    render() {
        const info = this.getContentInfo();
        return (
                <div style={{overflow: 'auto', maxHeight: 60+'vh', margin: '20px'}}>
                    <Comment.Group>
                        <Header as='h3' dividing>
                            Comments for "{info.contentName}" by {info.userName}
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
                </div>
        )
    }
}

export default CommentSection;