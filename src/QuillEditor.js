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
    <span className="ql-formats">
      <select className="ql-size">
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

  }

  componentDidMount(){
    window.katex = katex;
  }

	render() {
		return (<div>
          <Card style={{height: '70vh', 'max-width': '600px'}}>
            <CardContent>
              <CustomToolbar />
              <hr/>
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
        "insertGraph": insertGraph,
      }
    }
  }

QuillEditor.propTypes = {
    placeholder: PropTypes.string,
  }

export default QuillEditor;