import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Quiz from './quizEditor/Quiz';
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

  render() {
    return (
      <div>
        {this.props.isQuizSlide ? ( // ternary beginning
          <Quiz value={this.props.slide.content}
                onQuizChange={this.onQuizChange} />
        ) : ( // ternary middle
          <ReactQuill value={this.props.slide.content}
                      onChange={this.handleChange} /> 
        ) } 
      </div>
    )
  }
}


export default SlideEditor;
