import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import Rating from "./Rating"
import globals from "./globals"
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import NotFoundPage from './NotFoundPage'
import CircularProgress from '@material-ui/core/CircularProgress';
import GameView from "./GameView"
import { firebase } from './firebase';
import HyperVideoEditor from './HyperVideoEditor';
import Comment from './Comment'
import {CoolPinkButton} from "./stylings";
import {CoolBlueButton} from "./stylings";

const buttonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};


class ContentView extends Component {
    constructor(props, {match}) {
        super(props);
        this.state = {
            slideIdx: 0,
            content: null,
            hasLoaded: false,
            timing: [],
            lastTime: new Date(),
            startTime: new Date(),
            endTime: null,
            showComments:false,
        };
        console.log(match, props, "MAATCH")

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        this.userName = directory[0];
        this.contentName = directory[1];

        // console.log(this.props, "MATCH")
        // const userName = this.props.match.params.username;
        // const contentName = this.props.match.params.contentname;
        

        const APICALL = `https://api.joinoasys.org/user/${this.userName}/${this.contentName}/`;

        const that = this;
        fetch(APICALL, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                console.log(myJson);
                that.setState({content: myJson[0], hasLoaded: true})
            });
    }

    activateComments(){
        this.setState({
            showComments:true
        })
    }

    deactivateComments(){
        this.setState({
            showComments:false
        })
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > this.state.content.data.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    whatRenderer(slide) {
        this.authUsername = '';
        this.props.authUser
        ?this.authUsername = this.props.authUser
        :null
        this.contentLength = this.state.content.data.length;
        switch(slide.type) {
            case globals.QUILL:
                return (
                    <div>
                    <Preview content={slide.content}/>
                    {this.state.showComments
                        ?(
                            <CoolBlueButton size="small" onClick={this.deactivateComments.bind(this)} >
                              Hide Comments
                            </CoolBlueButton>
                        )
                        : (
                            <CoolBlueButton size="small" onClick={this.activateComments.bind(this)} >
                              Show Comments
                            </CoolBlueButton>

                        )
                    }                    
                    {this.state.showComments
                    ?<Comment name={this.authUsername} slideNumber={this.state.slideIdx} slideLength={this.contentLength}/>
                    :null
                    }
                    </div>
                    )
            case globals.QUIZ:
                return (
                    <div>
                    <QuizPreview content={slide.content}/>
                    {this.state.showComments
                        ?(
                            <CoolBlueButton size="small" onClick={this.deactivateComments.bind(this)} >
                              Hide Comments
                            </CoolBlueButton>
                        )
                        : (
                            <CoolBlueButton size="small" onClick={this.activateComments.bind(this)} >
                              Show Comments
                            </CoolBlueButton>

                        )
                    }
                    {this.state.showComments
                        ?<Comment name={this.authUsername} slideNumber={this.state.slideIdx} slideLength={this.contentLength}/>
                        :null
                    }
                    </div>
                    )
            case globals.GAME:
                return (
                    <div>
                    <GameView url={slide.content.url}/>
                    {this.state.showComments
                        ?(
                            <CoolBlueButton size="small" onClick={this.deactivateComments.bind(this)} >
                              Hide Comments
                            </CoolBlueButton>
                        )
                        : (
                            <CoolBlueButton size="small" onClick={this.activateComments.bind(this)} >
                              Show Comments
                            </CoolBlueButton>

                        )
                    }                    
                    {this.state.showComments
                        ?<Comment name={this.authUsername} slideNumber={this.state.slideIdx} slideLength={this.contentLength}/>
                        :null
                    }                    
                    </div>
                    )
            case globals.HYPERVIDEO:
                return (
                <div>
                {this.state.showComments
                    ?(
                        <CoolBlueButton size="small" onClick={this.deactivateComments.bind(this)} >
                          Hide Comments
                        </CoolBlueButton>
                    )
                    : (
                        <CoolBlueButton size="small" onClick={this.activateComments.bind(this)} >
                          Show Comments
                        </CoolBlueButton>

                    )                
                }                
                <HyperVideoEditor value={slide.content} preview={true}/>
                {this.state.showComments
                    ?<Comment name={this.authUsername} slideNumber={this.state.slideIdx} slideLength={this.contentLength}/>
                    :null
                }                
                </div>
                )
            default:
                return <div>not yet implemented ☹️</div>
        }
    }

    updateTiming() {
        const t1 = this.state.lastTime;
        const t2 = new Date();
        let timing = this.state.timing.slice();
        timing.push({i: this.state.slideIdx, t:t2-t1});
        let tobj = {
            startTime: this.state.startTime,
            timing: timing,
            lastTime: t2
        }
        return tobj
    }

    completeFetch(timeObj) {
        let contentId = null
        var username = this.userName;
        var saveEndpoint = 'https://api.joinoasys.org/saveUserContentAccess';
        var data = {
          "accessTimes": timeObj.timing,
          "startTime": timeObj.startTime,
          "endTime": timeObj.endTime,
          "contentId": this.state.content.contentId,
          "accessUserId": this.props.authUser.displayName,
          "contentUserId": this.state.content.userId
        }
        fetch(saveEndpoint, {
          method: 'POST', 
          body: JSON.stringify(data),
          headers: new Headers({
           'Content-Type': 'application/json',
             })
          });
    }

    handleNext() {
        let idx = this.state.slideIdx+1;
        let tobj = this.updateTiming();
        this.setState({ slideIdx: idx });
        let endTime = null;
        if (idx === this.state.content.data.length - 1) {
            endTime = new Date();
            tobj.endTime = endTime;
            this.setState(tobj);
        } else {
            tobj.endTime = this.state.endTime;
        }
        this.completeFetch(tobj);
    }

    handlePrevious() {
        let tobj = this.updateTiming();
        tobj.endTime = this.state.endTime;
        this.setState({
            slideIdx: this.state.slideIdx - 1,
        });
        this.completeFetch(tobj);
    }

    handleStepChange(newStep) {
        this.setState({
            slideIdx: newStep
        })
    }

    render() {
        if (!this.state.hasLoaded) {
            return <center><CircularProgress style={{ color: 'orange' }} thickness={7} /></center>
        }

        const content = this.state.content;
        if (!content) {
            return <NotFoundPage />
        }

        return (
            <div>
            <center>
                <SwipeableViews
                      axis={'x'}
                      index={this.state.slideIdx}
                      onChangeIndex={this.handleStepChange.bind(this)}
                      enableMouseEvents
                      style={{width: '640px'}}
                    >
                    {content.data.map(slide => (
                        this.whatRenderer(slide)
                    ))}
                    <Rating username={this.props.authUser}/>
                    </SwipeableViews>
                    <MobileStepper
                      steps={content.data.length + 1}
                      activeStep={this.state.slideIdx}
                      style = {{position: 'relative', bottom: '0', width: '100%', minHeight: 12 + "vh"}}
                      nextButton={
                        <Button size="large" style={this.state.slideIdx === content.data.length ? null : buttonStyle} onClick={this.handleNext.bind(this)} disabled={this.state.slideIdx === content.data.length}>
                          Next
                          {<KeyboardArrowRight />}
                        </Button>
                      }
                      backButton={
                        <Button size="large" style={this.state.slideIdx === 0 ? null : buttonStyle} onClick={this.handlePrevious.bind(this)} disabled={this.state.slideIdx === 0}>
                          {<KeyboardArrowLeft />}
                          Back
                        </Button>
                      }
                    />
            </center>
            </div>
        );
    }
}

export default ContentView;
