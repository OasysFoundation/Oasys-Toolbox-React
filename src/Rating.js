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
			<div>
				<h1>Completed! Thank you for playing</h1>
				<Rate onChange={this.handleChange} value={this.state.value} disabled={this.state.diabled} />
			</div>
		)
	}
}

export default Rating;