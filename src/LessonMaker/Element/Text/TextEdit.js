import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import ToolbarQuill from './ToolbarQuill';

import 'react-quill/dist/quill.snow.css';

import './assets/QuillEdit.css';
import textBoldIcon from './assets/quillBoldIcon.png';
import textItalicIcon from './assets/quillItalicIcon.png';
import textLinkIcon from './assets/quillLinkIcon.png';
import textQuoteIcon from './assets/quillQuoteIcon.png';
import textColorIcon from './assets/quillColorIcon.png';


class TextEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' }
        this.lastSaved = Date.now();

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

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(content, delta, source, editor) {
        this.setState({ text: content});
        const now = Date.now();
        if (now - this.lastSaved > 1000) {
            // save at most once every second. prevents weird loops that cause quill to re-render three times
            this.lastSaved = now;
            console.log('saving ', content)
            this.props.handleAction({type: 'save', value: content});
        }
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.data!==this.state.text) {
            console.log('getting ', nextprops.data)
            this.setState({text: nextprops.data});
        }
    }

    componentDidMount() {
        this.props.handleReady(true);
    }

    render() {

        let modules = {
            toolbar: {
                container: '#toolbar-quill-' + this.props.id,
            },
        }
        return (
            <div id={'quill-container-' + this.props.id}>
                {ToolbarQuill(this.props.id, false)}
                {/*always hide*/}
                {/*{this.renderToolbar()}*/}
                <ReactQuill
                    value={this.state.text}
                    onChange={this.handleChange}
                    modules={modules}
                    bounds={'quill-container-' + this.props.id}
                    readOnly={false}
                />
            </div>
        )
    }
}

export default TextEdit;