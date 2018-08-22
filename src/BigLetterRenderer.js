import React, {Component} from 'react';
// import PropTypes from 'prop-types';



class BigLetterRenderer extends Component {

    render() {
        return (
            <div style={{fontSize: '100px'}}>
            	{this.props.value}
            </div>
        );
    }
}

// BigLetterRenderer.propTypes = {};

export default BigLetterRenderer;
