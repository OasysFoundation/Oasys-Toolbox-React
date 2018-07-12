import React, {Component} from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import SimpleReply from './SimpleReply'
var moment = require('moment');


function SimpleComment(props){
  
  const {time, accessUser, comment} = props.contentData[0];
  props.contentData.shift();

  return(
   <Comment>
      <Comment.Avatar src='https://oasys-space.nyc3.digitaloceanspaces.com/person.png' />
      <Comment.Content>
        <Comment.Author as='a'>{accessUser}</Comment.Author>
        <Comment.Metadata>
          <div>{moment(time).format("DD MMM YYYY hh:mm a")}</div>
        </Comment.Metadata>
        <Comment.Text>{comment}</Comment.Text>
        {props.reply(time)}
      </Comment.Content>
      <Comment.Group>

      { props.contentData
        ? props.contentData.map((d,i) => < SimpleReply key={i} contentData={d}/>)
        : null
      }

      </Comment.Group>
    </Comment>
    )
}

export default SimpleComment;
