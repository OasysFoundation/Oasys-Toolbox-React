import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PropTypes from 'prop-types';
import katex from 'katex';
import ToolbarQuill from './ToolbarQuill'

import 'katex/dist/katex.min.css';
import 'react-quill/dist/quill.snow.css';

import './assets/QuillEdit.css';
import textBoldIcon from './assets/quillBoldIcon.png';
import textItalicIcon from './assets/quillItalicIcon.png';
import textLinkIcon from './assets/quillLinkIcon.png';
import textQuoteIcon from './assets/quillQuoteIcon.png';
import textColorIcon from './assets/quillColorIcon.png';

let Embed = Quill.import('blots/embed');

class GraphBlot extends Embed {
    static create(initialValue) {
        const node = super.create();
        node.setAttribute("spellcheck", false);

        window.d3 = require('d3');
        const functionPlot = require('function-plot');
        // for more options see https://github.com/mauriciopoppe/function-plot
        functionPlot({
            width: 400,
            height: 300,
            target: node,
            disableZoom: true,
            data: [{
                fn: initialValue.equation
            }]
        })
        node.equation = initialValue.equation;
        return node;
    }

    static value(node) {
        return {
            equation: node.equation
        };
    }
}

GraphBlot.blotName = 'graph';
GraphBlot.tagName = 'div';
GraphBlot.className = 'graph';

Quill.register(GraphBlot);


function insertGraph() {
    let cursorPosition = this.quill.getSelection()
    if (cursorPosition === null) {
        cursorPosition = {index: 0, length: 0};
        this.quill.setSelection(cursorPosition);
    }
    this.quill.insertText(cursorPosition.index, "★")
    this.quill.setSelection(cursorPosition.index + 1)
}

class TextEdit extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
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
        this.props.handleAction({type: 'save', value: content});
    }

    componentWillReceiveProps() {
        if (this.mounted) {
            if (this.props.isEditMode) {
                this.refs.reactQuill.getEditor().enable();
            } else {
                this.refs.reactQuill.getEditor().disable();
            }
        }
        return true;
    }

    componentDidMount() {
        window.katex = katex;
        window.d3 = require('d3');
        this.mounted = true;
        this.props.handleReady();

        // for enabling graphing in quill, uncomment the following
        /*
        const quill = this.refs.reactQuill.getEditor();
        window.quill = quill;

        window.document.getElementById('graph-button-'+this.props.id).addEventListener('click', function(e) {
            var equation = prompt("Enter equation","x^3");

            if (equation != null) {
              let cursorPosition = quill.getSelection();
              if (cursorPosition === null) {
                cursorPosition = { index: 0, length: 0 };
                quill.setSelection(cursorPosition);
              }
              quill.insertEmbed(cursorPosition.index + 1, 'graph', {equation: equation}, Quill.sources.USER);
            }
        });
        */
    }

    render() {

        let modules = {
            toolbar: {
                container: '#toolbar-quill-' + this.props.id,
                handlers: {
                    "insertGraph": insertGraph,
                }
            },
            // //imageDrop: true,
            // imageResize: {
            //   parchment: Quill.import('parchment'),
            //   modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            // }
            //imageDrop: true,
            //imageResize: {
            //  parchment: Quill.import('parchment'),
            //  modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            //}
        }

        return (
            <div id={'quill-container-' + this.props.id}>
                {ToolbarQuill(this.props.id, false)}
                {/*always hide*/}
                {/*{this.renderToolbar()}*/}
                <ReactQuill
                    value={this.props.data}
                    onChange={this.handleChange}
                    ref="reactQuill"
                    modules={modules}
                    bounds={'quill-container-' + this.props.id}
                />
            </div>
        )
    }
}

Text.propTypes = {
    placeholder: PropTypes.string,
}

export default TextEdit;