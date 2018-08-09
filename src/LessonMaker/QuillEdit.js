import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PropTypes from 'prop-types';
import katex from 'katex';

import 'katex/dist/katex.min.css';
// import "highlight.js/styles/atom-one-light.css";

import '../styles/QuillEdit.css';
import graphIcon from '../assets/icons/graph.jpg';

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

// this is an example for a highly customized toolbar
// see https://devarchy.com/react/library/react-quill
const BigToolbar = () => (
  <div id="toolbar-quill">
    <span className="ql-formats">
      <select className="ql-size">
          <option value="12px">Small</option>
          <option value="16px" selected>Normal</option>
          <option value="22px">Large</option>
          <option value="30px">Huge</option>
      </select>
      <select className="ql-font">
        <option value="arial" className="ql-font-arial">Arial</option>
        <option value="bookman" className="ql-font-bookman">Bookman</option>
        <option value="courier" className="ql-font-courier">Courier</option>
        <option value="garamond" className="ql-font-garamond">Garamond</option>
        <option value="georgia" className="ql-font-georgia">Georgia</option>
        <option value="helvetica" selected className="ql-font-helvetica">Helvetica</option>
        <option value="palatino" className="ql-font-palatino">Palatino</option>
        <option value="times" className="ql-font-times">Times</option>
        <option value="verdana" className="ql-font-verdana">Verdana</option>
      </select>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="sub"></button>
      <button className="ql-script" value="super"></button>
    </span>
    <br/>
    <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <select className="ql-align"></select>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      <button className="ql-video"></button>
      <button className="ql-formula"></button>
      <button className="ui button" id="graph-button"><img src={graphIcon} width={30} alt=""/></button>
    </span>

  </div>
)

function insertGraph () {
  let cursorPosition = this.quill.getSelection()
  if (cursorPosition === null) {
    cursorPosition = { index: 0, length: 0 };
    this.quill.setSelection(cursorPosition);
  }
  this.quill.insertText(cursorPosition.index, "★")
  this.quill.setSelection(cursorPosition.index + 1)
}

class QuillEditor extends Component {

  constructor(props) {
    super(props);
    // define custom icons
    let icons = ReactQuill.Quill.import('ui/icons');
    icons['header']['1'] = '';

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
    
  }

  renderToolbar(){
    return (
      <div id={'toolbar-quill-'+this.props.id}>
        <span className="ql-formats">
          <button className="ql-header" style={{fontSize: '21px', marginTop: '0px'}}>T</button>
          <button className="ql-header" value="1" style={{fontSize: '30px', marginTop: '-6px'}}>T</button>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-blockquote"></button>
          <select className="ql-background" style={{marginTop: '-2px'}}>
            <option value="#cccccc" />
            <option value="#f06666" />
            <option value="#ffc266" />
            <option value="#ffff66" />
            <option value="#66b966" />
            <option value="#66a3e0" />
            <option value="#c285ff" />
            <option value="#ffffff" />
            <option value="#facccc" />
            <option value="#ffebcc" />
            <option value="#ffffcc" />
            <option value="#cce8cc" />
            <option value="#cce0f5" />
            <option value="#ebd6ff" />
          </select>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
          <button className="ui button" id={'graph-button-'+this.props.id} style={{padding: '0px'}}>
            <img src={graphIcon} width={16} height={16} alt="" />
          </button>
        </span>

      </div>
    )
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
          {this.renderToolbar()}
          <hr/>
          <ReactQuill
              onChange={this.props.onChange}
              ref="reactQuill"
              modules={modules}
              bounds={'quill-container-'+this.props.id}
          /> 
        </div>
    )
	}
}

QuillEditor.propTypes = {
  placeholder: PropTypes.string,
}

export default QuillEditor;