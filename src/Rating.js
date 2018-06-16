import React, {Component} from 'react';
import { Rate } from 'antd';

class Rating extends Component {
	constructor(props){
		super(props);
		this.setState({ value: props.value, disabled: props.disabled});
	}

	handleChange = (value) => {
		this.setState({ value });
	}

	render(){
		return (
			<Rate onChange={this.handleChange} value={this.state.value} disabled={this.state.diabled} />
		)
	}
}

export default Rating;