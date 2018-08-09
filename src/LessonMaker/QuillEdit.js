import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PropTypes from 'prop-types';
import katex from 'katex';

import 'katex/dist/katex.min.css';

import '../styles/QuillEdit.css';
import graphIcon from '../assets/icons/graph.jpg';
import textBiggerIcon from '../assets/icons/quillTextBigIcon.png';
import textSmallerIcon from '../assets/icons/quillTextSmallIcon.png';
import textBoldIcon from '../assets/icons/quillBoldIcon.png';
import textItalicIcon from '../assets/icons/quillItalicIcon.png';
import textLinkIcon from '../assets/icons/quillLinkIcon.png';
import textQuoteIcon from '../assets/icons/quillQuoteIcon.png';
import textColorIcon from '../assets/icons/quillColorIcon.png';

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


function insertGraph () {
  let cursorPosition = this.quill.getSelection()
  if (cursorPosition === null) {
    cursorPosition = { index: 0, length: 0 };
    this.quill.setSelection(cursorPosition);
  }
  this.quill.insertText(cursorPosition.index, "★")
  this.quill.setSelection(cursorPosition.index + 1)
}

class QuillEdit extends Component {

  constructor(props) {
    super(props);
    // define custom icons
    let icons = ReactQuill.Quill.import('ui/icons');
    icons['header']['1'] = '';
    icons['bold'] = '<img src="'+textBoldIcon+'"/>';
    icons['italic'] = '<img src="'+textItalicIcon+'"/>';
    icons['blockquote'] = '<img src="'+textQuoteIcon+'"/>';
    icons['background'] = '<img src="'+textColorIcon+'"/>';
    icons['link'] = '<img src="'+textLinkIcon+'"/>';

    let font = ReactQuill.Quill.import('formats/font');
    font.whitelist = ['kievit'];
    ReactQuill.Quill.register(font, true);

    let fontSize = ReactQuill.Quill.import('attributors/style/size');
    fontSize.whitelist =  ['21px', '22px', '30px', 'small', 'normal', 'large', 'huge'];
    ReactQuill.Quill.register(fontSize, true);
  }

  componentDidMount() {
    window.katex = katex;
    window.d3 = require('d3')
    
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
        container: '#toolbar-quill-'+this.props.id,
        handlers: { "insertGraph": insertGraph,
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
        <div id={'quill-container-'+this.props.id}>
          {/*{this.renderToolbar()}*/}
            <ReactQuill
                // readOnly={this.props.readOnly}
                value={this.props.data}
                onChange={this.props.onChange}
                ref="reactQuill"
                modules={modules}
                bounds={'quill-container-' + this.props.id}
            />
        </div>
    )
	}
}

QuillEdit.propTypes = {
  placeholder: PropTypes.string,
}

export default QuillEdit;