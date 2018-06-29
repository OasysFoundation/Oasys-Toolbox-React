import React, {Component} from 'react';
import {Rate} from 'antd';
import 'antd/dist/antd.css';


class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value || 0, disabled: props.disabled, preview:props.preview};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (value) => {
        this.setState({value});
    }

    render() {
    	var completed;
    	if (this.state.preview) {
	      completed = null;
	    } else {
	      completed = <h1>Completed! Thank you for playing</h1>;
	    }

        return (
            <div>
                {completed}
                <Rate allowHalf onChange={this.handleChange} value={this.state.value} disabled={this.state.diabled}/>
            </div>
        )
    }


}





export default Rating;