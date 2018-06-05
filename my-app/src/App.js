import React, { Component } from 'react';
import SlidesThumbnailView from "./SlidesThumbnailView";
import MenuBarView from "./MenuBarView"
import EditorView from "./EditorView"
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

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //slides: [createSlide("Slide 1", "1",{ops:[{insert:"This is the editor. Write your content here. \n"}]},"quill")],
      slides: [defaultSlide],
      selectedSlideIndex: 0,
    }

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
  }

  onAddNewSlide() {
    let slides = this.state.slides;
    //const newSlideContent = {ops:[{insert:"This is the beginning of the exiting journey of slide no " + this.state.slides.length + "\n"}]};
    const newSlideContent = "This is the beginning of the exiting journey of slide no " + this.state.slides.length;
    slides.push(createSlide("New Slide", Math.random().toString(36), newSlideContent, "quill"));
    this.setState({
      slides: slides,
      selectedSlideIndex: slides.length - 1,
    });
  }

  onAddNewQuiz() {
    const slides = this.state.slides;
    const newSlideContent = {};
    slides.push(createSlide("New Quiz", Math.random().toString(36), newSlideContent, "quiz"));
    this.setState({
      slides: slides,
      selectedSlideIndex: slides.length
    });
  }

  onChangedSlide(newSlideIndex) {
    // this is where the slide state is changed, but it is not passed on to the quill component somehow.
    this.setState({
      selectedSlideIndex: newSlideIndex
    });
  }

  onEditSlide(content) {
    let slides = this.state.slides;
    slides[this.state.selectedSlideIndex].content = content;
    this.setState({
      slides: slides,
    });
  }

  render() {
    return (
      <div>
        <Grid container spacing={24}>
        <Grid item xs={12}>
          <MenuBarView />
        </Grid>
        <Grid item xs={3}>
          <SlidesThumbnailView slides={this.state.slides} 
                               onAddNewSlide={this.onAddNewSlide} 
                               onAddNewQuiz={this.onAddNewQuiz} 
                               selectedSlideIndex={this.state.selectedSlideIndex} 
                               onChangedSlide={this.onChangedSlide}/>
        </Grid>
        <Grid item xs={9}>
            <EditorView slide = {this.state.slides[this.state.selectedSlideIndex]}
                        funEditSlide = {this.onEditSlide.bind(this)} />
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
