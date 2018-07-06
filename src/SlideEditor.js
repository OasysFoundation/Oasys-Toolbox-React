import React, { Component } from 'react';
import Quiz from './Quiz';
import ModuleEditor from './ModuleEditor';
import glb from "./globals";
import 'react-quill/dist/quill.snow.css';
import QuillEditor from './QuillEditor'
import HyperVideoEditor from './HyperVideoEditor'
import GameEdit from "./GameEdit";

class SlideEditor extends Component {
  
  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);
  }

  conditionalRender() {
      if (this.props.slideType === undefined || this.props.slide === undefined) {
        return <div></div>
      } else if (this.props.slideType === glb.QUIZ) {
        return <Quiz value={this.props.slide.content}
              onChange={this.onChange} />
      } else if (this.props.slideType === glb.QUILL) {
       return <QuillEditor onChange={this.onChange} slideContent={this.props.slide.content}/>
      } else if (this.props.slideType === glb.GAME) {
         return <GameEdit onChange={this.onChange}
                          value={this.props.slide.content} />
      } else if (this.props.slideType === glb.HYPERVIDEO) {
        return <HyperVideoEditor onChange={this.onChange}
                                 value={this.props.slide.content} />
      } else {
        return <div></div>
      }
  }

  render() {
    return (this.conditionalRender())
  }
}


export default SlideEditor;
