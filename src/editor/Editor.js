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
import gameMetaData from "../gameMetaData";


//https://api.joinoasys.org/{userName}/{contentName}/save
const saveEndpoint = 'https://api.joinoasys.org/';
//https://api.joinoasys.org/{userName}/{contentName}
const loadEndpoint = 'https://api.joinoasys.org/';

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
    console.log("PARAMS", props.match)
    super(props);
    this.state = {
      //slides: [createSlide("Slide 1", "1",{ops:[{insert:"This is the editor. Write your content here. \n"}]},"quill")],
      slides: [defaultSlide],
      selectedSlideIndex: 0,
      currSlideType: glb.QUILL,
      contentId: defaultId,
      lastCapture: null,
      title: "Untitled Project"
    }

    this.onAddNewSlide = this.onAddNewSlide.bind(this);
    this.onAddNewQuiz = this.onAddNewQuiz.bind(this);
    this.onAddNewGame = this.onAddNewGame.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onChangedSlide = this.onChangedSlide.bind(this);
    this.onRemoveSlide = this.onRemoveSlide.bind(this);
    this.onAddNewHyperVideo = this.onAddNewHyperVideo.bind(this);
    this.onAddNewSystemSim = this.onAddNewSystemSim.bind(this);
    this.onLoad = this.onLoad.bind(this);

    if (props.match) {
        const link = "https://app.joinoasys.org/user/"+ props.match.params.userId +"/"+props.match.params.contentId;
        this.onLoad(link)
    }

  }

  onAddNewSlide(newSlideContent = null) { // Quill slides only
    let slides = this.state.slides;
    //const newSlideContent = {ops:[{insert:"This is the beginning of the exiting journey of slide no " + this.state.slides.length + "\n"}]};
    if (newSlideContent===null){
      "This is the beginning of the exiting journey of slide no " + (this.state.slides.length+1);
    }
    slides.push(createSlide("Slide ", Math.random().toString(36), newSlideContent, glb.QUILL));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.QUILL,
    });
    this.renderThumbnail()
  }

  onAddNewQuiz(content = null) {
    let slides = this.state.slides;
    const defaultQuizContent = {
      "question": "",
      "answers": [{"option": "", "correct": false}]
    };
    if (content===null){
      content = defaultQuizContent;
    }
    const newSlide = createSlide("Quiz ", Math.random().toString(36), content, glb.QUIZ);
    slides.push(newSlide);
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.QUIZ,
    });
    this.renderThumbnail()
  }

    onAddNewGame(content = null) {
        let slides = this.state.slides;
        // if (content===null){
        //   content = gameMetaData[0];
        // }
        slides.push(createSlide("Game ", Math.random().toString(36), content, glb.GAME));
        const newSlideIndex = slides.length -1;
        this.setState({
            slides: slides,
            selectedSlideIndex: newSlideIndex,
            currSlideType: glb.GAME,
        });
        this.renderThumbnail()
    }

    onAddNewSystemSim(content = null) {
        let slides = this.state.slides;
        // if (content===null){
        //   content = gameMetaData[0];
        // }
        if (content === null) {
          content = {url: ""}
        }
        slides.push(createSlide("SystemSim ", Math.random().toString(36), content, glb.SYSTEM));
        const newSlideIndex = slides.length -1;
        this.setState({
            slides: slides,
            selectedSlideIndex: newSlideIndex,
            currSlideType: glb.SYSTEM,
        });
        this.renderThumbnail()
    }


    onAddNewModule(content = null) {
        let slides = this.state.slides;
        let defaultContent = {
            code: [],
            ifstate: glb.IF_BODY,
            boolstate: glb.BOOL_DISABLED,
            moduleId: Math.random().toString(36)
        }
        if (content===null){
          content = defaultContent;
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

  onAddNewHyperVideo(content = null) {
    let slides = this.state.slides;
    let defaultContent = {
      "videoURL": null,
      "quizzes": []
    }
    if (content===null){
      content = defaultContent;
    }
    console.log(content)
    slides.push(createSlide("Hypervideo ", Math.random().toString(36), content, glb.HYPERVIDEO));
    const newSlideIndex = slides.length -1;
    this.setState({
      slides: slides,
      selectedSlideIndex: newSlideIndex,
      currSlideType: glb.HYPERVIDEO,
    });
    this.renderThumbnail()
  }

  onChangedSlide(newSlideIndex) {
    console.log("SLIDES ", this.state.slides);
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
    // update thumbnail
    let elem;
    let type;
    const that = this;
      try {
          type = slides[this.state.selectedSlideIndex].type;
      }
      catch (error) {
        console.log("Problem with rendering the Thumbnail");
        return;
      }

      console.log(" SLIDE ", slides[this.state.selectedSlideIndex])
      const slide = slides[that.state.selectedSlideIndex];

      let canvasWidth = 640;
      let canvasHeight = 480;
      if (this.state.selectedSlideIndex < 0 || this.state.selectedSlideIndex === undefined) {
        return;
      } else if (slides[this.state.selectedSlideIndex].type === glb.QUILL) {
        elem = document.querySelector(".ql-editor");
      } else if (slides[this.state.selectedSlideIndex].type === glb.QUIZ) {
        elem = document.getElementById("quizPreview");
      } else if (slides[this.state.selectedSlideIndex].type === glb.GAME) {
        elem = document.getElementById("gameRenderer");
      } else if (slides[this.state.selectedSlideIndex].type === glb.HYPERVIDEO) {
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

  /*save(id, publish, title, username, tags, pictureURL, description) {
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
  } */

  onRemoveSlide(index){
    console.log(index)
    let slides = this.state.slides.slice();
    slides.splice(index, 1);
    this.setState({
      currSlideType: -1,
      slides: slides
    });
    this.onSlideOrderChange(slides);
  }

  insertNewSlide(slide) {
    console.log(slide)
    if (slide === undefined) {
      return;
    } else if (slide.type === glb.QUILL) {
      this.onAddNewSlide(slide.content);
    } else if (slide.type === glb.QUIZ) {
      this.onAddNewQuiz(slide.content);
    } else if (slide.type === glb.GAME) {
      this.onAddNewGame(slide.content);
    } else if (slide.type === glb.HYPERVIDEO) {
      this.onAddNewHyperVideo(slide.content);
    } 
  }

  insertMultipleSlides(slides){
    console.log(slides)
    for (let i=0; i<slides.length; i++) {
      this.insertNewSlide(slides[i]);
    }
  }

  onLoad(link) {
    //this.show('Opening…');
    var loadContent = link;
    loadContent = loadContent.replace("app.joinoasys.org", "api.joinoasys.org");

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
            that.setState({
              title: myJson[0].contentId
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
        <Grid container spacing={24}>
        <Grid item xs={12}>
          <MenuBarView onLoad={this.onLoad.bind(this)} slides={this.state.slides} authUser={this.props.authUser} contentTitle={this.state.title}/>
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
                               onAddNewSlide={this.onAddNewSlide} 
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
            <SlideEdit slide = {this.state.slides[this.state.selectedSlideIndex]}
                         slideType = {this.state.currSlideType}
                         onChange = {this.onEditorChange.bind(this)} />
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default Editor;
