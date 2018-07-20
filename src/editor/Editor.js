import React, { Component } from 'react';
import SlidesThumbnailView from "./SlidesThumbnailView";
import MenuBarView from "./MenuBarView";
import SlideEdit from "./SlideEdit";
import Grid from '@material-ui/core/Grid';
import html2canvas from 'html2canvas';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EditIcon from '@material-ui/icons/Edit';
import LoadingDialog from '../LoadingDialog'
import WelcomeToEditor from './WelcomeToEditor'
import SlideTypeSelection from './SlideTypeSelection'

import glb from "../globals";
import TextIcon from '../icons/Text.png'
import QuizIcon from '../icons/Quiz.png'
import GameIcon from '../icons/Game.png'
import HypervideoIcon from '../icons/Hypervideo.png'
import SystemSimulationIcon from '../icons/SystemSimulation.png'

//import gameMetaData from "../gameMetaData";


function contentIdGenerator() {
  return Math.random().toString(36);
}

function slideIdGenerator() {
  return Math.random().toString(36);
}

function createSlide(name, identifier, content, type) {
  return {
    name: name,
    identifier: identifier,
    content: content,
    type: type,
    thumb: null
  }
}

class Editor extends Component {

  constructor(props) {
    console.log("PARAMS", props.match)
    super(props);
    

    var shouldDownloadContent = false;

    if (props.match) {
        const link = "user/" + props.match.params.userId + "/" + props.match.params.contentId;
        this.onLoad(link);  
        shouldDownloadContent = true;
    }

    this.state = {
      slides: [],
      selectedSlideIndex: 0,
      currSlideType: -1,
      contentId: contentIdGenerator(),
      lastCapture: null,
      title: "Untitled",
      description: '',
      tags: '',
      downloadingContent: shouldDownloadContent,
      showsSlideSelection: false
    };

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onRemoveSlide = this.onRemoveSlide.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onAddNewSlide(type, content=null) {
    this.hideSlideSelection();
    //let slides = this.state.slides.slice();
    let slides = this.state.slides.slice(); // this is unsafe but works better
    if (content === null) {
      switch(type) {
        case glb.EDIT_QUILL:
          content = "";
          break;
        case glb.EDIT_QUIZ:
          content = {
            "question": "",
            "answers": [{"option": "", "correct": false}]
          };
          break;
        case glb.EDIT_GAME:
          content = null;
          break;
        case glb.EDIT_HYPERVIDEO:
          content = {
            "videoURL": null,
            "quizzes": []
          }
          break;
        case glb.EDIT_SYSTEM:
          content = {url: ""};
          break;
        default:
          content = null;
      }
    } 
    slides.push(createSlide(type, slideIdGenerator(), content, type));

    const currentIndex = this.state.selectedSlideIndex;
    const newSlideIndex = slides.length -1;

    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: type,
    }, function(){
      this.renderDefaultThumbnail(newSlideIndex, type);
      if (slides.length > 1) {
        this.renderThumbnail(currentIndex);
      }
    });
  }

  onChangedSlide(newSlideIndex) {
    // gets called when user selects another slide
    console.log("onChangedSlide");
    let slideType = null;
    if (this.state.slides.length > 0) {
      slideType = this.state.slides[newSlideIndex].type;
    }
    const currentIndex = this.state.selectedSlideIndex;
    const newState = {
      selectedSlideIndex: newSlideIndex,
      currSlideType: slideType,
    }
    this.renderThumbnail(currentIndex, newState);
  }

  onEditorChange(content) {
    let slides = this.state.slides.slice();
    slides[this.state.selectedSlideIndex].content = content;

    if (Date.now() - this.state.lastCapture > 2500) {
      this.setState({
        lastCapture: Date.now()
      })
    } else {
        this.setState({slides: slides});
    }
  }

  renderDefaultThumbnail(idx) {
    let slides = this.state.slides.slice();
    let slide = slides[idx];
    let image = null;
    if (slide.type === glb.EDIT_QUILL) { image = TextIcon; } 
    else if (slide.type === glb.EDIT_QUIZ) { image = QuizIcon; } 
    else if (slide.type === glb.EDIT_GAME) { image = GameIcon; } 
    else if (slide.type === glb.EDIT_HYPERVIDEO) { image = HypervideoIcon; } 
    else if (slide.type === glb.EDIT_SYSTEM) { image = SystemSimulationIcon; } 
    else  { return; } 
    slide.thumb = image;
    slides[idx] = slide
    this.setState({slides: slides});
  }

  renderThumbnail(currentIndex, newState) {
    if (this.state.slides.length===0 || 
        currentIndex < 0 || 
        currentIndex === undefined) { 
      return; 
    }
    // thumbnail size is currently 80x60
    console.log("rendering thumb started:" + currentIndex);
    let canvasWidth = 640;
    let canvasHeight = 480;
    let selector = null;
    let slides = this.state.slides.slice();
    let slide = slides[currentIndex];

    if (slide.type === glb.EDIT_QUILL) { selector = ".ql-editor"; } 
    else if (slide.type === glb.EDIT_QUIZ) { } 
    else if (slide.type === glb.EDIT_GAME) { selector = "#gameRenderer"; } 
    else if (slide.type === glb.EDIT_HYPERVIDEO) { selector = "#hyperVideoEditor"; } 
    else if (slide.type === glb.EDIT_SYSTEM) { } 
    else  { } 

    let elem = document.querySelector(selector);
    
    const opts = {
      width: canvasWidth, 
      height: canvasHeight,
      quality: 0.5,
    };

    if (elem instanceof HTMLElement) {
      let style = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
      if (slide.type === glb.EDIT_QUILL && parseInt(style.height) < 100) {
        this.renderDefaultThumbnail(currentIndex);
        this.setState(newState);
      } else {
        html2canvas(elem, opts).then(function(canvas) {
          slide.thumb = canvas.toDataURL("image/jpeg", 0.3);
          slides[currentIndex] = slide;
          console.log("rendering thumb done:" + currentIndex);
          if (newState===undefined) {
            this.setState({slides: slides});
          } else {
            newState.slides = slides;
            this.setState(newState);
          }
        }.bind(this))
      }
    } else {
      this.setState(newState);
    }
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


  onRemoveSlide(index){
    let slides = this.state.slides.slice();
    slides.splice(index, 1);
    this.setState({
      currSlideType: -1,
      slides: slides
    });
    this.onSlideOrderChange(slides);
  }

  insertMultipleSlides(slides){
    if (slides.length===0 || slides[0] === undefined) {
      return;
    } 

    this.onAddNewSlide(slides[0].type, slides[0].content);
    this.setState({
      slides: slides,
      selectedSlideIndex: 0,
      currSlideType: slides[0].type,
    });

    slides.forEach((slide, i) => {
      if (slide.type === glb.EDIT_QUIZ || slide.type === glb.EDIT_SYSTEM) {
        this.renderDefaultThumbnail(i);
      } else {
        this.renderDefaultThumbnail(i);
        //this.renderThumbnail(i);
      }
    });

    /*
    for (let i=0; i<slides.length; i++) {
      if (slides[i] === undefined) {
        return;
      } 
      this.onAddNewSlide(slides[i].type, slides[i].content);
    }
    */
  }

  onLoad(link) {

    //this.show('Opening…');
    var loadContent = glb.OASYS_API_BASE + link;
    console.log(loadContent);
    var that = this;
    fetch(loadContent, {
      method: 'GET'
    }).then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(myJson) {
        that.setState({selectedSlideIndex: 0, currSlideType: -1});
        const len = that.state.slides.length;
        for (let i=len-1; i>=0; i--) {
          that.onRemoveSlide(i);
        }
        
        if (myJson.length > 0) {
          if (myJson[0].data === undefined || !Array.isArray(myJson[0].data)) {
            console.log("this is not a correct data format")
          } else {
            that.insertMultipleSlides(myJson[0].data);
            console.log(myJson[0].description);
            that.setState({
              title: myJson[0].contentId,
              description: myJson[0].description,
              tags: myJson[0].tags,
              downloadingContent: false
            });
          }
        }
      });


    //this.handleClose();

  }

  onChangeTitle(event) {
    this.setState({
      title: event.target.value
    })
  }

  showSlideSelection() {
    this.setState({
      showsSlideSelection: true
    });
  }

  hideSlideSelection() {
    this.setState({
      showsSlideSelection: false
    }); 
  }

  render() {
    return (
      <div>
        <SlideTypeSelection open={this.state.showsSlideSelection} onClose={this.hideSlideSelection.bind(this)} onSelect={this.onAddNewSlide.bind(this)}/>
        <LoadingDialog open={this.state.downloadingContent} message='Loading Content…' />
        <Grid container spacing={24}>
        <Grid item xs={12}>
          <MenuBarView onLoad={this.onLoad.bind(this)} slides={this.state.slides} authUser={this.props.authUser} contentTitle={this.state.title} hashtags={this.state.tags} description={this.state.description}/>
          <TextField
                      id="search"
                      value={this.state.title}
                      type="text"
                      margin="normal"
                      style={{marginLeft: "20px"}}
                      onChange={this.onChangeTitle.bind(this)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EditIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
        </Grid>
        <Grid item xs={3}>
          <SlidesThumbnailView slides={this.state.slides} 
                               selectedSlideIndex={this.state.selectedSlideIndex}
                               onSlideOrderChange = {this.onSlideOrderChange}
                               onChangedSlide = {this.onChangedSlide.bind(this)}
                               onRemoveSlide = {this.onRemoveSlide}
                               onAddNewSlide = {this.showSlideSelection.bind(this)}
                               />
        </Grid>
        <Grid item style={{width: '720px'}}>
            {this.state.slides.length==0? <WelcomeToEditor createNewSlide={this.showSlideSelection.bind(this)}/>            
              :
              <SlideEdit slide = {this.state.slides[this.state.selectedSlideIndex]}
                         slideType = {this.state.currSlideType}
                         onChange = {this.onEditorChange.bind(this)} />
            }
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default Editor;
