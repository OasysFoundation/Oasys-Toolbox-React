import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ContentView extends Component {
    render() {
        return (
            <div>CONTENT VIEW !!</div>
        );
    }
}

ContentView.propTypes = {
    elements: PropTypes.array.isRequired
};

export default ContentView;
