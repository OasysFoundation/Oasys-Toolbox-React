import React, {Component} from 'react';
import {Rate} from 'antd';
import 'antd/dist/antd.css';
import Comment from './Comment'
import DoneIcon from '@material-ui/icons/CheckCircle';




class Rating extends Component {
    constructor(props) {
        super(props);

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        const userName = directory[0]
        const contentName = directory[1]

        this.state = {
            value: props.value || 0, 
            preview:props.preview,
            username: userName,
            contentname: contentName

        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (value) => {
        this.setState({value});

        

        const APICALL = `https://api.joinoasys.org/rate/${this.state.username}/${this.state.contentname}/${value}`;

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
    	var completed, ratingElement,commented;
    	if (this.state.preview) {
	      completed = null;
	      commented = null;
	      ratingElement = <Rate allowHalf value={this.state.value} disabled/>
	    } else {
	      completed = <div><p>  Please take a moment to give <i>{this.state.username}</i> some feedback for <i>{this.state.contentname}</i>.<br/><br/>Tell us more about what you learned, how much you learned, and how you liked the content you interacted with.</p></div>;
	      commented = <Comment name={this.props.username} slideNumber="end"/>
	      ratingElement = <Rate allowHalf onChange={this.handleChange} value={this.state.value}/>
	    }

        return (
            <div style={{marginTop:'20px', textAlign:'left'}}>
                <center style={{marginBottom:'40px'}}>
                <DoneIcon color="secondary" style={{ fontSize: '100px' }}/>
                <h1>Completed</h1> 
                </center>
                {completed}
                <center style={{marginBottom:'40px', marginTop:'30px'}}>
                {ratingElement}
                </center>
                {commented}
            </div>
        )
    }


}





export default Rating;