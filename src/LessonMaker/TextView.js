import React, { Component } from 'react';
import 'react-quill/dist/quill.snow.css';
import QuillEdit from './QuillEdit'

import PropTypes from 'prop-types';




//this is the new "Preview" Component
class TextView extends Component {
    render(){
        return (
            <QuillEdit data={this.props.content}/>
        )
    }
}

TextView.modules = {
    toolbar: null
}

TextView.propTypes = {
    isEditable: PropTypes.bool
}

export default TextView;