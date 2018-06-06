import React, { Component } from 'react';
import SlidesThumbnailView from "./SlidesThumbnailView";
import MenuBarView from "./MenuBarView"
import SlideEditor from "./SlideEditor"
import Grid from '@material-ui/core/Grid';

const EditorContext = React.createContext('');

function createSlide(name, identifier, content, type) {
  return {
    name: name,
    identifier: identifier,
    content: content,
    type: type
  }
}

const defaultSlide = createSlide("Slide 1", "1","This is the editor. Write your content here.","quill");

class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //slides: [createSlide("Slide 1", "1",{ops:[{insert:"This is the editor. Write your content here. \n"}]},"quill")],
      slides: [defaultSlide],
      selectedSlideIndex: 0,
      isQuizSlide: false,
    }

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
    this.save = this.save.bind(this);
  }

  onAddNewSlide() {
    let slides = this.state.slides;
    //const newSlideContent = {ops:[{insert:"This is the beginning of the exiting journey of slide no " + this.state.slides.length + "\n"}]};
    const newSlideContent = "This is the beginning of the exiting journey of slide no " + (this.state.slides.length+1);
    slides.push(createSlide("Slide " + (slides.length+1), Math.random().toString(36), newSlideContent, "quill"));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      isQuizSlide: this.isQuizSlide(newSlideIndex),
    });
  }

  onAddNewQuiz() {
    let slides = this.state.slides;
    const defaultQuizContent = {
      "question": "",
      "answers": [{"option": "", "correct": false}]
    };
    const newSlide = createSlide("Slide " + (slides.length+1), Math.random().toString(36), defaultQuizContent, "quiz");
    slides.push(newSlide);
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      isQuizSlide: this.isQuizSlide(newSlideIndex),
    });
    console.log(this.state);
    console.log(slides);
    console.log(newSlide);
  }

  isQuizSlide(newSlideIndex){
    let isQuizSlide = false;
    if (this.state.slides[newSlideIndex].type === "quiz") {
      isQuizSlide = true;
    }
    return isQuizSlide
  }

  onChangedSlide(newSlideIndex) {
    this.setState({
      selectedSlideIndex: newSlideIndex,
      isQuizSlide: this.isQuizSlide(newSlideIndex),
    });
  }

  onEditSlide(content) {
    let slides = this.state.slides;
    slides[this.state.selectedSlideIndex].content = content;
    this.setState({
      slides: slides,
    });
  }

  onQuizChange(content){
    let slides = this.state.slides;
    slides[this.state.selectedSlideIndex].content = content;
    this.setState({
      slides: slides,
    });
  }

  save() {
    var json = JSON.stringify(this.state.slides);
    console.log(json);
  }

  render() {
    return (
      <div>
        <Grid container spacing={24}>
        <Grid item xs={12}>
          <MenuBarView onSave={this.save} />
        </Grid>
        <Grid item xs={3}>
          <SlidesThumbnailView slides={this.state.slides} 
                               onAddNewSlide={this.onAddNewSlide} 
                               onAddNewQuiz={this.onAddNewQuiz} 
                               selectedSlideIndex={this.state.selectedSlideIndex} 
                               onChangedSlide={this.onChangedSlide} />
        </Grid>
        <Grid item xs={7}>
            <SlideEditor slide = {this.state.slides[this.state.selectedSlideIndex]}
                         funEditSlide = {this.onEditSlide.bind(this)}
                         isQuizSlide = {this.state.isQuizSlide}
                         onQuizChange = {this.onQuizChange.bind(this)} />
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default Editor;
