import React, {Component} from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import SimpleComment from './SimpleComment'

class CommentSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
          comments:[],
          comment:'',
        }

        var that = this;
        const loc = window.location.href;
      const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
      const contentName = directory[1];
        var loadComments = 'https://api.joinoasys.org/user/'+contentName+'/comments';
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

    onSubmit = (e) => {

      const loc = window.location.href;
      const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
      const contentName = directory[1];
      var myUsername = ''
      this.props.name?
      myUsername = this.props.name.displayName
      : null

      var commentEndpoint = 'https://api.joinoasys.org/'+myUsername+'/'+contentName+'/comment';
      var currentTime = Date.now();
      var data = {
        "time":currentTime,
        "comment":this.state.comment,
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

        });
    }

    addComment = (event) => {

      this.setState({
        comment:event.target.value
      })
    }

    handleChange = (value) => {
        this.setState({value});

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        const userName = directory[0]
        const contentName = directory[1]

        const APICALL = `https://api.joinoasys.org/${userName}/${contentName}/rate/${value}`;

        fetch(APICALL, {
      method: 'POST'
    }).then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
      });


    }

    render() {
        return (
          <div>
            <Comment.Group>
    <Header as='h3' dividing>
      Comments
    </Header>
    {this.state.comments.length==0?
      (null)
      : (
      this.state.comments.map((d,i) => < SimpleComment key={i} contentData={d}/>)
      )
    }
    

    <Form reply>
      <Form.TextArea onChange={this.addComment.bind(this)}/>
      <Button onClick={this.onSubmit.bind()} content='Add Reply' labelPosition='left' icon='edit' primary />
    </Form>
  </Comment.Group>
  </div>
        )
    }
}
export default CommentSection;