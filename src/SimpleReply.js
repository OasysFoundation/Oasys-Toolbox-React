import React, {Component} from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
var moment = require('moment');


function SimpleReply(props){
  
  const {time, accessUser, comment} = props.contentData;

  return(
   <Comment>
      <Comment.Avatar src='https://oasys-space.nyc3.digitaloceanspaces.com/person.png' />
      <Comment.Content>
        <Comment.Author as='a'>{accessUser}</Comment.Author>
        <Comment.Metadata>
          <div>{moment(time).format("DD MMM YYYY hh:mm a")}</div>
        </Comment.Metadata>
        <Comment.Text>{comment}</Comment.Text>
      </Comment.Content>
    </Comment>
    )
}

export default SimpleReply;
