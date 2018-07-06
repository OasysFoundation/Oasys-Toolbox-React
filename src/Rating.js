import React, {Component} from 'react';
import {Rate} from 'antd';
import 'antd/dist/antd.css';
import Comment from './Comment'


class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value || 0, preview:props.preview};
        this.handleChange = this.handleChange.bind(this);
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
    	var completed, ratingElement,commented;
    	if (this.state.preview) {
	      completed = null;
	      commented = null;
	      ratingElement = <Rate allowHalf value={this.state.value} disabled/>
	    } else {
	      completed = <h1>Completed! Thank you for playing</h1>;
	      commented = <Comment/>
	      ratingElement = <Rate allowHalf onChange={this.handleChange} value={this.state.value}/>
	    }

        return (
            <div>
                {completed}
                {ratingElement}
                {commented}

            </div>
        )
    }


}





export default Rating;