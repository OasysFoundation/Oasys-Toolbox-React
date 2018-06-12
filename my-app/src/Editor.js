import React, { Component } from 'react';
import SlidesThumbnailView from "./SlidesThumbnailView";
import MenuBarView from "./MenuBarView";
import SlideEditor from "./SlideEditor";
import Grid from '@material-ui/core/Grid';
import glb from "./globals";

const saveEndpoint = 'http://174.138.2.82/saveEditor';
const defaultId = 666;

function createSlide(name, identifier, content, type) {
  return {
    name: name,
    identifier: identifier,
    content: content,
    type: type
  }
}

const defaultSlide = createSlide("Slide", "1","This is the editor. Write your content here.", glb.QUILL);

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //slides: [createSlide("Slide 1", "1",{ops:[{insert:"This is the editor. Write your content here. \n"}]},"quill")],
      slides: [defaultSlide],
      selectedSlideIndex: 0,
      currSlideType: glb.QUILL,
    }

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onAddNewGame = this.onAddNewGame.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.save = this.save.bind(this);
  }

  onAddNewSlide() { // Quill slides only
    let slides = this.state.slides;
    //const newSlideContent = {ops:[{insert:"This is the beginning of the exiting journey of slide no " + this.state.slides.length + "\n"}]};
    const newSlideContent = "This is the beginning of the exiting journey of slide no " + (this.state.slides.length+1);
    slides.push(createSlide("Slide ", Math.random().toString(36), newSlideContent, glb.QUILL));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.QUILL,
    });
  }

  onAddNewQuiz() {
    let slides = this.state.slides;
    const defaultQuizContent = {
      "question": "",
      "answers": [{"option": "", "correct": false}]
    };
    const newSlide = createSlide("Quiz ", Math.random().toString(36), defaultQuizContent, glb.QUIZ);
    slides.push(newSlide);
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.QUIZ,
    });
  }

  onAddNewGame() {
    let slides = this.state.slides;
    let content = {
      code: [],
      ifstate: glb.IF_BODY,
      boolstate: glb.BOOL_DISABLED,
      contentId: 0
    }
    slides.push(createSlide("Game ", Math.random().toString(36), content, glb.GAME));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.GAME,
    });
  }

  onChangedSlide(newSlideIndex) {
    this.setState({
      selectedSlideIndex: newSlideIndex,
      currSlideType: this.state.slides[newSlideIndex].type,
    });
  }

  onEditorChange(content) {
    let slides = this.state.slides;
    slides[this.state.selectedSlideIndex].content = content;
    this.setState({
      slides: slides,
    });
  }

  onSlideOrderChange(slides){
    this.setState({
      slides: slides,
    });
    if (this.state.selectedSlideIndex >= this.state.slides.length) {
      this.onChangedSlide(this.state.slides.length-1);
    }
  }

  save() {
    var json = JSON.stringify({slides: this.state.slides});

    fetch(saveEndpoint, {
      method: 'POST', 
      body: json,
      headers: new Headers({
       'Content-Type': 'application/json',
        'id': defaultId
     })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));

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
                               onAddNewGame={this.onAddNewGame} 
                               selectedSlideIndex={this.state.selectedSlideIndex} 
                               onChangedSlide={this.onChangedSlide} 
                               onSlideOrderChange = {this.onSlideOrderChange}  />
        </Grid>
        <Grid item xs={7}>
            <SlideEditor slide = {this.state.slides[this.state.selectedSlideIndex]}
                         slideType = {this.state.currSlideType}
                         onChange = {this.onEditorChange.bind(this)} />
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default Editor;
