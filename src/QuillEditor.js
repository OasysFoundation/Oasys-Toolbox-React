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



// see https://devarchy.com/react/library/react-quill
const CustomButton = () => <span className="latexButton" />
const CustomToolbar = () => (
  <div id="toolbar">
    <span class="ql-formats">
      <select class="ql-size">
      </select>
      <select class="ql-font">
        <option value="inconsolata" className="ql-font-inconsolata">Inconsolata</option>
        <option value="mirza" selected className="ql-font-mirza">Mirza</option>
        <option value="roboto" className="ql-font-roboto">Roboto</option>
        <option value="sailec" className="ql-font-sailec">Sailec Light</option>
        <option value="sofia" className="ql-font-sofia">Sofia Pro</option>
        <option value="ubuntu" className="ql-font-ubuntu">Ubuntu</option>
      </select>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </span>
    <br/>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <br/>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <select class="ql-align"></select>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span>
    <span class="ql-formats">
      <button className="ql-insertStar">
        <CustomButton />
      </button>
    </span>
  </div>
)

function insertEquation () {
  const cursorPosition = this.quill.getSelection().index
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
    fontSize.whitelist = ['12px', '18px', '24px', '30px'];
    ReactQuill.Quill.register(fontSize, true);

    let formula = ReactQuill.Quill.import('formats/formula');
    font.whitelist = ['formula'];
    ReactQuill.Quill.register(formula, true);
  }

  componentDidMount(){
    window.katex = katex;
  }

	render() {
		return (<div>
          <Card style={{height: '70vh', 'max-width': '600px'}}>
            <CardContent>
              <CustomToolbar />
              <ReactQuill value={this.props.slideContent}
                        onChange={this.onChange}
                        style={{height: '60vh'}}
                        modules={QuillEditor.modules}
                          /> 
            </CardContent>
          </Card>
        </div>)
	}
}

// this needs to be defined after the QuillEditor Component
QuillEditor.modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        "insertEquation": insertEquation,
      }
    }
  }

QuillEditor.propTypes = {
    placeholder: PropTypes.string,
  }

export default QuillEditor;