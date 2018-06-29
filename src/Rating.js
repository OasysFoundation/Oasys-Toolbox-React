import React, {Component} from 'react';
import {Rate} from 'antd';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value || 0, disabled: props.disabled || true};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (value) => {
        this.setState({value});
    }

    render() {
        return (
            <div>
                <h1>Completed! Thank you for playing</h1>
                <Rate onChange={this.handleChange} value={this.state.value} disabled={this.state.diabled}/>
            </div>
        )
    }
}

export default Rating;