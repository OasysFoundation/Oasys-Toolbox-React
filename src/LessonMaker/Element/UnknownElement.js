import React from 'react';
import PropTypes from 'prop-types';

class UnknownElement extends React.Component {
	constructor(props) {
		super(props);
		if ('handleReady' in props) {
			this.props.handleReady(true);
		}
	}
	render() {
		return (
			<div key={"1234567890"}>
				Could not render element of type {this.props.type} (unknown element type) 
			</div>
		)
	}
}

UnknownElement.propTypes = {
    elemType: PropTypes.number.isRequired,
};

export default UnknownElement;