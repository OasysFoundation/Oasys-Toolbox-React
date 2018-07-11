import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './ReactQuill.css';

// see https://devarchy.com/react/library/react-quill
const CustomButton = () => <span className="latexButton" />
const CustomToolbar = () => (
  <div id="toolbar">
    <select class="ql-size">
        <option value="12px">Small</option>
        <option selected value="18px">Medium</option>
        <option value="24px">Large</option>
        <option value="30px">Huge</option>
    </select>
    <select class="ql-font">
      <option value="mirza" selected>Mirza</option>
      <option value="roboto">Roboto</option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>    
    <button className="ql-insertEquation">
      <CustomButton />
    </button>
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

    let font = ReactQuill.Quill.import('formats/font'); // <<<< ReactQuill exports it
    font.whitelist = ['mirza', 'roboto']; // allow ONLY these fonts and the default
    ReactQuill.Quill.register(font, true);

    let fontSize = ReactQuill.Quill.import('attributors/style/size');
    fontSize.whitelist = ['12px', '18px', '24px', '30px'];
    ReactQuill.Quill.register(fontSize, true);
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