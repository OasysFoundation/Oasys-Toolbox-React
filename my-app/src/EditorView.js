import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


class EditorView extends Component {
  
  constructor(props) {
    super(props);
    // this.content = this.props.slide.content;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.content = value;
    this.props.funEditSlide(value);
  }

  render() {
    return (
      <ReactQuill value={this.props.slide.content}
                  onChange={this.handleChange} />
    )
  }
}


export default EditorView;
