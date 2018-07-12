import React, {Component} from 'react';
import {Button, Comment, Form, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import SimpleComment from './SimpleComment'
import OrganizeComments from './OrganizeComments'


class CommentSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            comment: '',
            reply: '',
            currentReply: '',
            finalComments: [],
            slideLength: this.props.slideLength,
        }
        this.slideNumber = '';

        if ((typeof(this.props.slideNumber) == "number") && ((this.props.slideNumber) == this.props.slideLength))
            this.slideNumber = "end"
        else
            this.slideNumber = this.props.slideNumber;


        if (!this.props.match) {
            var that = this;
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            const contentName = directory[1];
            var loadComments = 'https://api.joinoasys.org/comment/user/' + contentName + '/' + this.slideNumber;
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
        else {
            var that = this;
            const contentName = this.props.match.params.contentId;
            var loadComments = 'https://api.joinoasys.org/comment/user/' + contentName + '/' + this.slideNumber;
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

    }

    onSubmitReply = (e, id) => {

        var parent = e;
        var contentName = '';

        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = directory[1];
        }
        else {
            contentName = this.props.match.params.contentId;
        }

        var myUsername = '';
        this.props.name ?
            myUsername = this.props.name.displayName
            : null

        var commentEndpoint = 'https://api.joinoasys.org/comment/' + myUsername + '/' + contentName;
        var currentTime = Date.now();
        if (typeof(this.slideNumber) == "number")
            this.slideNumber = this.slideNumber.toString()
        var data = {
            "time": currentTime,
            "comment": this.state.currentReply,
            "parent": parent,
            "slideNumber": this.slideNumber,
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
    }

    onSubmit = (e) => {

        var contentName = '';

        if (!this.props.match) {
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            contentName = directory[1];
        }
        else {
            contentName = this.props.match.params.contentId;
        }


        var myUsername = ''
        this.props.name ?
            myUsername = this.props.name.displayName
            : null

        var commentEndpoint = 'https://api.joinoasys.org/comment/' + myUsername + '/' + contentName;
        var currentTime = Date.now();
        if (typeof(this.slideNumber) == "number")
            this.slideNumber = this.slideNumber.toString()
        var data = {
            "time": currentTime,
            "comment": this.state.comment,
            "slideNumber": this.slideNumber,
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
            reply: id
        })

    }

    myReply = (id) => {
        return (
            <div>
                <Comment.Actions>
                    <Button content='Reply' onClick={this.someFunction.bind(this, id)}/>
                </Comment.Actions>
                {this.state.reply == id
                    ? (
                        <Form reply>
                            <Form.TextArea value={this.state.currentReply} onChange={this.addReply.bind(this)}/>
                            <Button onClick={this.onSubmitReply.bind(this, id)} content='Add Reply' labelPosition='left'
                                    icon='edit' primary/>
                        </Form>
                    )
                    : (null)
                }

            </div>
        )
    }

    handleChange = () => {

        if (!this.props.match) {
            var that = this;
            const loc = window.location.href;
            const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
            const contentName = directory[1];
            var loadComments = 'https://api.joinoasys.org/comment/user/' + contentName + '/' + this.slideNumber;
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
        else {
            var that = this;
            const contentName = this.props.match.params.contentId;
            var loadComments = 'https://api.joinoasys.org/comment/user/' + contentName + '/' + this.slideNumber;
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
    }

    render() {
        return (
            <section>
                <div style={{overflow: 'auto', maxHeight: 60+'vh'}}>
                    <Comment.Group>
                        <Header as='h3' dividing>
                            Comments
                        </Header>

                        <Form reply style={{marginBottom:'30px'}}>
                            <Form.TextArea value={this.state.comment} onChange={this.addComment.bind(this)}/>
                            <Button onClick={this.onSubmit.bind()} content='Add Comment' labelPosition='left' icon='edit'
                                    primary/>
                        </Form>

                        {this.state.comments.length == 0 ?
                            (null)
                            : (
                                <OrganizeComments comments={this.state.comments} reply={this.myReply.bind(this)}/>
                            )
                        }

                        
                    </Comment.Group>
                </div>
            </section>
        )
    }
}

export default CommentSection;