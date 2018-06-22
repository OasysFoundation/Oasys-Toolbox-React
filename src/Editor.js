import React, { Component } from 'react';
import SlidesThumbnailView from "./SlidesThumbnailView";
import MenuBarView from "./MenuBarView";
import SlideEditor from "./SlideEditor";
import Grid from '@material-ui/core/Grid';
import html2canvas from 'html2canvas';
import glb from "./globals";


//https://api.joinoasys.org/{userName}/{contentName}/save
const saveEndpoint = 'https://api.joinoasys.org/';
//https://api.joinoasys.org/{userName}/{contentName}
const loadEndpoint = 'https://api.joinoasys.org/';
const defaultId = 666;

function createSlide(name, identifier, content, type) {
  return {
    name: name,
    identifier: identifier,
    content: content,
    type: type,
    thumb: null
  }
}

const defaultSlide = createSlide("Slide", "1","This is the start of your exciting educational story.", glb.QUILL);

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //slides: [createSlide("Slide 1", "1",{ops:[{insert:"This is the editor. Write your content here. \n"}]},"quill")],
      slides: [defaultSlide],
      selectedSlideIndex: 0,
      currSlideType: glb.QUILL,
      contentId: defaultId,
      lastCapture: null
    }

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onAddNewGame = this.onAddNewGame.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
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
    this.renderThumbnail()
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
    this.renderThumbnail()
  }

  onAddNewGame() {
    let slides = this.state.slides;
    let content = {
      code: [],
      ifstate: glb.IF_BODY,
      boolstate: glb.BOOL_DISABLED,
      moduleId: Math.random().toString(36)
    }
    slides.push(createSlide("Game ", Math.random().toString(36), content, glb.GAME));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.GAME,
    });
    this.renderThumbnail()
  }

  onChangedSlide(newSlideIndex) {
    
    let slideType = null;
    if (this.state.slides.length > 0) {
      slideType = this.state.slides[newSlideIndex].type;
    }
    this.setState({
      selectedSlideIndex: newSlideIndex,
      currSlideType: slideType,
    });
  }

  onEditorChange(content) {
    let slides = this.state.slides;
    slides[this.state.selectedSlideIndex].content = content;

    if (Date.now() - this.state.lastCapture > 2500) {
      this.setState({
        lastCapture: Date.now()
      })
      this.renderThumbnail()
      
    } else {
        this.setState({slides: slides});
    }
  }

  renderThumbnail() {
    let slides = this.state.slides;

    // update thumbnail
    let elem;
    if (slides[this.state.selectedSlideIndex].type === glb.QUILL) {
      elem = document.querySelector(".ql-editor");
    } else if (slides[this.state.selectedSlideIndex].type === glb.QUIZ) {
      elem = document.getElementById("quizPreview");
    } else if (slides[this.state.selectedSlideIndex].type === glb.GAME) {
      elem = document.getElementById("pseudoCodePreview");
    } 

    html2canvas(elem, {width: 160, height: 120}).then(canvas => {
        slides[this.state.selectedSlideIndex].thumb = canvas.toDataURL("image/png");
        this.setState({slides: slides});
      });
  }

  // gets called after slide is removed, or slides have been rearranged via drag and drop
  onSlideOrderChange(slides, idxold, idxnew){
    let index = this.state.selectedSlideIndex;
    if (index === idxold) { index = idxnew; } 
    else if (index < idxold && index >= idxnew) { index++; }
    else if (index > idxold && index <= idxnew) { index--; }
    this.setState({
      slides: slides,
      selectedSlideIndex: index
    });
    if (this.state.selectedSlideIndex >= this.state.slides.length) {
      this.onChangedSlide(this.state.slides.length-1);
    }
  }

  // TODO: When endpoint accepts publish flag, we need to update here
  save(id, publish) {
    if (id!==null) {
      this.setState({contentId: id});
    }
    if (publish===null) {
      publish = false;
    }
    console.log(id)
    var json = JSON.stringify({slides: this.state.slides});

    fetch(saveEndpoint, {
      method: 'POST', 
      body: json,
      headers: new Headers({
       'Content-Type': 'application/json',
        'id': id
     })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  }

  load(id) {
    fetch(loadEndpoint, {
      method: 'GET', 
      headers: new Headers({
        'id': id,
      })
    }).then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        this.setState({contentId: id});
        console.log(myJson);
      });

  }

  render() {
    return (
      <div>
        <Grid container spacing={24}>
        <Grid item xs={12}>
          <MenuBarView onSave={this.save} onLoad={this.load}/>
        </Grid>
        <Grid item xs={3}>
          <SlidesThumbnailView slides={this.state.slides} 
                               onAddNewSlide={this.onAddNewSlide} 
                               onAddNewQuiz={this.onAddNewQuiz} 
                               onAddNewGame={this.onAddNewGame} 
                               selectedSlideIndex={this.state.selectedSlideIndex} 
                               onSlideOrderChange = {this.onSlideOrderChange}
                               onChangedSlide = {this.onChangedSlide}   />
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
