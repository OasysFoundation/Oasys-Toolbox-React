import React, { Component } from 'react';
import Editor from './Editor';
import './App.css';
import ReactQuill from 'react-quill';
class App extends Component {
  render() {
    return (
      <Editor/>
    );
  }
}


export default App