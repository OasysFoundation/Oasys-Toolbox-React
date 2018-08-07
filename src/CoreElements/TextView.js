import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import QuillEdit from './QuillEdit'

import PropTypes from 'prop-types';

import {textDataQuillExample} from './exampleContents'

// import QillEdit from '../editor/QuillEdit'
// import QuillEditor from "../editor/QuillEdit";



//this is the new "Preview" Component
class TextView extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <QuillEdit data={this.props.content}/>
        )
    }
}


{/*<div id={'quill-container'}>*/}
{/*<QuillEditor onChange={this.props.onChange} slideContent={this.props.content}/>*/}
{/*<ReactQuill value={textDataQuillExample || this.props.content}*/}
{/*// readOnly={this.props.isEditable ||true}*/}
{/*onChange={this.props.onChange}*/}
{/*// ref="reactQuill"*/}
{/*// bounds={'#quill-container'}*/}
{/*modules={TextView.modules}/>*/}
{/*</div>)*/}

TextView.modules = {
    toolbar: null
}

TextView.propTypes = {
    isEditable: PropTypes.bool
}

export default TextView;