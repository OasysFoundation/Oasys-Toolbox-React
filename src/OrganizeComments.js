import React, {Component} from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import SimpleComment from './SimpleComment'


function OrganizeComments(props) {
      var finalComments = [];

      for(var i = 0; i < props.comments.length; i++){
        var comment = props.comments[i];
        if(!comment.parent){
          var newArr = [];
          newArr.push(comment);
          finalComments.push(newArr);
        }
        else{
          var arrLength = finalComments.length;
          for(var j = 0; j < arrLength; j++){
            if(finalComments[j][0].time==comment.parent){
              finalComments[j].push(comment);
            }
          }
        }
      }

      console.log(finalComments);

      return(
      	<div>
		    {finalComments.length==0?
		      (null)
		      : (
		      finalComments.map((d,i) => < SimpleComment key={i} contentData={d} reply={props.reply}/>)
		      )
		    }
		</div>

      	)
    }

    export default OrganizeComments;