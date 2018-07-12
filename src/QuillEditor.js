import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import katex from 'katex';

import 'katex/dist/katex.min.css';
import "highlight.js/styles/atom-one-light.css";
import './ReactQuill.css';
import d3 from "d3"


let BlockEmbed = Quill.import('blots/block/embed');
let Embed = Quill.import('blots/embed');

class GraphBlot extends Embed {
  static create(initialValue) {
    const node = super.create();
  node.setAttribute("spellcheck", false);
  console.log(initialValue);


  window.d3 = require('d3')
  const functionPlot = require('function-plot')
  const plot = functionPlot({
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


// see https://devarchy.com/react/library/react-quill
const CustomButton = () => <span className="latexButton" />
const CustomToolbar = () => (
  <div id="toolbar-quill">
    <span className="ql-formats">
      <select className="ql-size">
          <option value="12px">Small</option>
          <option value="16px">Normal</option>
          <option value="22px">Large</option>
          <option value="30px">Huge</option>
      </select>
      <select className="ql-font">
        <option value="inconsolata" className="ql-font-inconsolata">Inconsolata</option>
        <option value="mirza" selected className="ql-font-mirza">Mirza</option>
        <option value="roboto" className="ql-font-roboto">Roboto</option>
        <option value="sailec" className="ql-font-sailec">Sailec Light</option>
        <option value="sofia" className="ql-font-sofia">Sofia Pro</option>
        <option value="ubuntu" className="ql-font-ubuntu">Ubuntu</option>
      </select>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
    </span>
    <br/>
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
      <button class="ui button" id="graph-button">Insert Graph</button>
    </span>
    <span className="ql-formats">
      <button className="ql-insertGraph">
        <CustomButton />
      </button>
    </span>

  </div>
)

function insertGraph () {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★")
  this.quill.setSelection(cursorPosition + 1)
}

class QuillEditor extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);

    let font = ReactQuill.Quill.import('formats/font');
    font.whitelist = ['mirza', 'roboto', 'sofia', 'slabo', 'sailec', 'roboto', 'inconsolata', 'ubuntu'];
    ReactQuill.Quill.register(font, true);

    let fontSize = ReactQuill.Quill.import('attributors/style/size');
    fontSize.whitelist =  ['12px', '16px', '22px', '30px', 'small', 'normal', 'large', 'huge'];
    ReactQuill.Quill.register(fontSize, true);

  }

  componentDidMount(){
    window.katex = katex;
    window.d3 = require('d3')
    
    const quill = this.refs.reactQuill.getEditor();
    console.log("quill");
    console.log(quill);

    window.document.getElementById('graph-button').addEventListener('click', function(e) {
      var equation=prompt("Enter equation","x^3");
        if (equation != null) {

          const cursorPosition = quill.getSelection().index
          quill.insertEmbed(cursorPosition + 1, 'graph', {equation: equation}, Quill.sources.USER);
        }
    });
  }

	render() {
		return (<div>
          <Card style={{height: '70vh', 'max-width': '600px'}}>
            <CardContent id='quill-container'>
              <CustomToolbar />
              <hr/>
              <ReactQuill
                  value={this.props.slideContent}
                  onChange={this.onChange}
                  ref="reactQuill"
                  style={{height: '60vh'}}
                  modules={QuillEditor.modules}
                  bounds={'#quill-container'}
              /> 
            </CardContent>
          </Card>
        </div>)
	}
}

// this needs to be defined after the QuillEditor Component
QuillEditor.modules = {
    toolbar: {
      container: "#toolbar-quill",
      handlers: {
        "insertGraph": insertGraph,
      }
    }
  }

QuillEditor.propTypes = {
    placeholder: PropTypes.string,
  }

export default QuillEditor;