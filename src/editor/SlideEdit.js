import React, { Component } from 'react';
import QuizEdit from './QuizEdit';
import ModuleEdit from './ModuleEdit';
import glb from "../globals";
import 'react-quill/dist/quill.snow.css';
import QuillEdit from './QuillEdit'
import HyperVideoSetup from './HyperVideoSetup'
import GameEdit from "./GameEdit";
import SystemSimEdit from "./SystemSimEdit";

class SlideEditor extends Component {
  
  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);
  }

  conditionalRender() {
      if (this.props.slideType === undefined || this.props.slide === undefined) {
        return <div></div>
      } else if (this.props.slideType === glb.QUIZ) {
        return <QuizEdit value={this.props.slide.content}
              onChange={this.onChange} />
      } else if (this.props.slideType === glb.QUILL) {
       return <QuillEdit onChange={this.onChange} slideContent={this.props.slide.content}/>
      } else if (this.props.slideType === glb.GAME) {
         return <GameEdit onChange={this.onChange}
                          value={this.props.slide.content} />
      } else if (this.props.slideType === glb.HYPERVIDEO) {
        return <HyperVideoSetup onChange={this.onChange}
                                 value={this.props.slide.content} />
      } else if (this.props.slideType === glb.SYSTEM) {
          return <SystemSimEdit onChange={this.onChange}
                                  value={this.props.slide.content}
                                editing={true}
          />
      } else {
        return <div></div>
      }
  }

  render() {
    return (this.conditionalRender())
  }
}


export default SlideEditor;
