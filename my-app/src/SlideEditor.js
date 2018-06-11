import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Quiz from './quizEditor/Quiz';
import ModuleEditor from './moduleEditor/ModuleEditor';
import glb from "./globals";
import 'react-quill/dist/quill.snow.css';

class SlideEditor extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onQuizChange = this.props.onQuizChange.bind(this);
  }

  handleChange(value) {
    this.props.funEditSlide(value);
  }

  conditionalRender(){
     if (this.props.slideType === glb.QUIZ) {
        return <Quiz value={this.props.slide.content}
              onQuizChange={this.onQuizChange} />
      } else if (this.props.slideType === glb.QUILL) {
       return <ReactQuill value={this.props.slide.content}
                    onChange={this.handleChange}  /> 
      } else if (this.props.slideType === glb.GAME) {
        return <ModuleEditor />
      }
  }

  render() {
    return (this.conditionalRender())
  }
}


export default SlideEditor;
