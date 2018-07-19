import React, { Component } from 'react';
import SlidesThumbnailView from "../SlidesThumbnailView";
import MenuBarView from "../MenuBarView";
import SlideEdit from "./SlideEdit";
import Grid from '@material-ui/core/Grid';
import html2canvas from 'html2canvas';
import glb from "../globals";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EditIcon from '@material-ui/icons/Edit';
import LoadingDialog from '../LoadingDialog'
import WelcomeToEditor from './WelcomeToEditor'

//import gameMetaData from "../gameMetaData";

/* TODO for refactor:
1) it seems like contentId is not used any more, but instead only this.state.title, but this is "Untitled Project" project
   unless user sets it. So, we should remove contentId, and force users to set the title (otherwise they cannot save)
2) Why do we need name for slides, instead of just using type? Either delete name, or define new global for it.
3) defaultSlide.content should be a string in a global lang_EN file.
4) Is slide.identifier used anywhere? If so, why is it set to 1 in defaultSlide?
5) All handlers that are defined by a component and are given to other components should be combined into an object
6) Add environment variable that we can use to flip between production and development
7) API call urls should be defined globally somewhere
8) refactor onAddNewQuiz, anAddNewGame etc into one fuction
9) Have a global function that calculates slide identifier with Math.random().toString(36)
10) replace DOM id access with React ref access
*/


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
      downloadingContent: shouldDownloadContent
    };

    this.onAddNewQuill = this.onAddNewQuill.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onAddNewGame = this.onAddNewGame.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
    this.onRemoveSlide = this.onRemoveSlide.bind(this);
    this.onAddNewHyperVideo = this.onAddNewHyperVideo.bind(this);
    this.onAddNewSystemSim = this.onAddNewSystemSim.bind(this);
    this.onLoad = this.onLoad.bind(this);

    

  }

  onAddNewSlide(type, content=null) {
    //let slides = this.state.slides.slice();
    let slides = this.state.slides; // this is unsafe but works better
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
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: type,
    });
    this.renderThumbnail();
    console.log(slides)
  }

  onAddNewQuill(newSlideContent = null) { // Quill slides only
    this.onAddNewSlide(glb.EDIT_QUILL, newSlideContent);
  }

  onAddNewQuiz(content = null) {
    this.onAddNewSlide(glb.EDIT_QUIZ, content);
  }

    onAddNewGame(content = null) {
    this.onAddNewSlide(glb.EDIT_GAME, content);
    }

    onAddNewSystemSim(content = null) {
    this.onAddNewSlide(glb.EDIT_SYSTEM, content);
    }


    onAddNewModule(content = null) {
    this.onAddNewSlide(glb.EDIT_MODULE, content);
    }

  onAddNewHyperVideo(content = null) {
    this.onAddNewSlide(glb.EDIT_HYPERVIDEO, content);
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
    let slides = this.state.slides.slice();
    slides[this.state.selectedSlideIndex].content = content;

    console.log("set slide content: " + slides[this.state.selectedSlideIndex].content.quizzes);

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
    let slides = this.state.slides.slice();
    if (slides.length===0) {
      return;
    }
    // update thumbnail
    let elem;
    const that = this;

      console.log(" SLIDE ", slides[this.state.selectedSlideIndex])
      const slide = slides[that.state.selectedSlideIndex];

      let canvasWidth = 640;
      let canvasHeight = 480;

      if (this.state.selectedSlideIndex < 0 || this.state.selectedSlideIndex === undefined) {
        return;
      } else if (slides[this.state.selectedSlideIndex].type === glb.EDIT_QUILL) {
        elem = document.querySelector(".ql-editor");
      } else if (slides[this.state.selectedSlideIndex].type === glb.EDIT_QUIZ) {
        elem = document.getElementById("quizPreview");
      } else if (slides[this.state.selectedSlideIndex].type === glb.EDIT_GAME) {
        elem = document.getElementById("gameRenderer");
      } else if (slides[this.state.selectedSlideIndex].type === glb.EDIT_HYPERVIDEO) {
        elem = document.getElementById("hyperVideoEditor");
      } 

    if (elem instanceof HTMLElement) {
      html2canvas(elem, {width: canvasWidth, height: canvasHeight}).then(function(canvas) {
          try {
              slide.thumb = canvas.toDataURL("image/png");
          }
          catch (error ){
            console.log("ERROR : ", error, "Maybe there is no .thumb property on the slide", slides[that.state.selectedSlideIndex])
          }
          that.setState({slides: slides});
        });
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
    console.log(slides)
    for (let i=0; i<slides.length; i++) {
      if (slides[i] === undefined) {
        return;
      } 
      this.onAddNewSlide(slides[i].type, slides[i].content);
    }
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

  render() {
    return (
      <div>
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
                               onAddNewSlide={this.onAddNewQuill} 
                               onAddNewQuiz={this.onAddNewQuiz} 
                               onAddNewGame={this.onAddNewGame} 
                               onAddNewHyperVideo={this.onAddNewHyperVideo}
                               onAddNewSystemSim={this.onAddNewSystemSim}
                               selectedSlideIndex={this.state.selectedSlideIndex}
                               onSlideOrderChange = {this.onSlideOrderChange}
                               onChangedSlide = {this.onChangedSlide}
                               onRemoveSlide = {this.onRemoveSlide}/>
        </Grid>
        <Grid item style={{width: '720px'}}>
            {this.state.slides.length==0? <WelcomeToEditor />            
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
