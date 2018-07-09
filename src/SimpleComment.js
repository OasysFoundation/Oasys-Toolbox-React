import React, {Component} from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';


function SimpleComment(props){
  const {time, userId, comment} = props.contentData;

  return(
   <Comment>
      <Comment.Avatar src='https://oasys-space.nyc3.digitaloceanspaces.com/person.png' />
      <Comment.Content>
        <Comment.Author as='a'>{userId}</Comment.Author>
        <Comment.Metadata>
          <div>Today at {time}</div>
        </Comment.Metadata>
        <Comment.Text>{comment}</Comment.Text>
      </Comment.Content>
    </Comment>
    )
}

export default SimpleComment;
