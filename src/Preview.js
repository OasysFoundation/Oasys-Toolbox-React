import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
    	return (
            <div>
                <ReactQuill value={this.props.content || "no content"} 
                            readOnly={true}
                            modules={Preview.modules}/>
            </div>)
    }
}

Preview.modules = {
    toolbar: null
}

export default Preview;