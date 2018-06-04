import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


class EditorView extends Component {
  
  constructor(props) {
    super(props)
    this.state = { text: this.props.slide.content }
    this.handleChange = this.handleChange.bind(this)
  }

  // this is where the state of the editor is updated, but only one letter is shown?
  handleChange(value) {
    this.setState({ text: value })
  }

  render() {
    return (
      <ReactQuill value={this.state.text}
                  onChange={this.handleChange} />
    )
  }
}


export default EditorView;
