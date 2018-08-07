import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';

import PropTypes from 'prop-types';

import {textDataQuillExample} from './exampleContents'

// import QillEdit from '../editor/QuillEdit'
// import QuillEditor from "../editor/QuillEdit";



//this is the new "Preview" Component
class TextView extends Component {
    constructor(props) {
        super(props);
        console.log(katex, "KATEX is here")
        window.katex = katex;

        const font = ReactQuill.Quill.import('formats/font');
        font.whitelist = ['mirza', 'roboto', 'sofia', 'slabo', 'sailec', 'roboto', 'inconsolata', 'ubuntu'];
        ReactQuill.Quill.register(font, true);

        const fontSize = ReactQuill.Quill.import('attributors/style/size');
        fontSize.whitelist =  ['12px', '16px', '22px', '30px', 'small', 'normal', 'large', 'huge'];
        ReactQuill.Quill.register(fontSize, true);
    }

    render(){
        return (
            <section>COOOL</section>
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