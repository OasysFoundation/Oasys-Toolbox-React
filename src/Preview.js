import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from '@material-ui/core/Button';
import katex from 'katex';

//next / previous Buttons

    

class Preview extends Component {
    constructor(props) {
    	super(props);
    	console.log(katex)
        window.katex = katex;
        
	    let font = ReactQuill.Quill.import('formats/font');
	    font.whitelist = ['mirza', 'roboto', 'sofia', 'slabo', 'sailec', 'roboto', 'inconsolata', 'ubuntu'];
	    ReactQuill.Quill.register(font, true);

	    let fontSize = ReactQuill.Quill.import('attributors/style/size');
	    fontSize.whitelist =  ['12px', '16px', '22px', '30px', 'small', 'normal', 'large', 'huge'];
	    ReactQuill.Quill.register(fontSize, true);
    }

    render(){
    	return (<ReactQuill value={this.props.content || "no content"} readOnly={true}  theme={null}/>)
    }
}

export default Preview;