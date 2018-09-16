import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import ToolbarQuill from './ToolbarQuill'

import 'react-quill/dist/quill.snow.css';

import './assets/QuillEdit.css';
import textBoldIcon from './assets/quillBoldIcon.png';
import textItalicIcon from './assets/quillItalicIcon.png';
import textLinkIcon from './assets/quillLinkIcon.png';
import textQuoteIcon from './assets/quillQuoteIcon.png';
import textColorIcon from './assets/quillColorIcon.png';


class TextView extends Component {
    constructor(props) {
        super(props);
        // define custom icons
        let icons = ReactQuill.Quill.import('ui/icons');
        icons['header']['1'] = '';
        icons['bold'] = '<img src="' + textBoldIcon + '" height="20"/>';
        icons['italic'] = '<img src="' + textItalicIcon + '" height="20"/>';
        icons['blockquote'] = '<img src="' + textQuoteIcon + '" height="20"/>';
        icons['background'] = '<img src="' + textColorIcon + '" height="20"/>';
        icons['link'] = '<img src="' + textLinkIcon + '" height="20"/>';

        let font = ReactQuill.Quill.import('formats/font');
        font.whitelist = ['Charter-Regular'];
        ReactQuill.Quill.register(font, true);

        let fontSize = ReactQuill.Quill.import('attributors/style/size');
        fontSize.whitelist = ['21px', '22px', '30px', 'small', 'normal', 'large', 'huge'];
        ReactQuill.Quill.register(fontSize, true);
    }

    componentDidMount() {
        this.props.handleReady(true);
    }

    render() {
        let modules = {
            toolbar: null,
        }
        return (
            <div id={'quill-container-' + this.props.id}>
                <ReactQuill
                    value={this.props.data}
                    readOnly={true}
                    toolbar={false}
                    modules={modules}
                />
            </div>
        )
    }
}

export default TextView;