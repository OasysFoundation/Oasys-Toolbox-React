import React, { Component } from 'react';
import Quiz from './Quiz';
import ModuleEditor from './ModuleEditor';
import glb from "./globals";
import 'react-quill/dist/quill.snow.css';
import QuillEditor from './QuillEditor'

class SlideEditor extends Component {
  
  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);
  }

  conditionalRender() {
     if (this.props.slideType === glb.QUIZ) {
        return <Quiz value={this.props.slide.content}
              onChange={this.onChange} />
      } else if (this.props.slideType === glb.QUILL) {
       return <QuillEditor onChange={this.onChange} slideContent={this.props.slide.content}/>
      } else if (this.props.slideType === glb.GAME) {
        return <ModuleEditor value={this.props.slide.content}
                             onChange={this.onChange} />
      } else {
        return <div></div>
      }
  }

  render() {
    return (this.conditionalRender())
  }
}


export default SlideEditor;
