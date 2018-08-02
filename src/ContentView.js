import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
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
import HyperVideoEdit from './editor/HyperVideoEdit';
import Comment from './Comment'
import {CoolBlueButton} from "./stylings";
import api from './tools'
import Media from "react-media";
import {Unwrap} from "./utils"
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
            showComments: false,
            quizzes: [],
            snackBarMessage:  "",
            showSnackBar: false,
            
        };
        console.log(match, props, "MAATCH")

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        this.userName = Unwrap(directory[0]);
        this.contentName = Unwrap(directory[1]);



        // console.log(this.props, "MATCH")
        // const userName = this.props.match.params.username;
        // const contentName = this.props.match.params.contentname;

        this.whatRenderer = this.whatRenderer.bind(this);

        api.getContent(this.userName, this.contentName)
            .then(content => this.setState({content: content[0], hasLoaded: true}))

        this.toggle = this.toggle.bind(this);
    }

    closeSnackBar() {
        this.setState({
          snackBarMessage: "",
          showSnackBar: false,
        });
    }

    showSnackBarError(msg){
        this.setState({
            snackBarMessage: msg,
            showSnackBar: true,
        })
    }

    toggle(key) {
        this.setState({[key]: !this.state[key]})
    }

    whatRenderer(slide, idx) {
        this.authUsername = null;
        if (this.props.authUser) {
            this.authUsername = this.props.authUser;
        }
        this.contentLength = this.state.content.data.length;

        let render = (<div>No Content to be found here</div>)

        switch (slide.type) {
            case globals.EDIT_QUILL:
                render = <Preview content={slide.content}/>
                break;

            case globals.EDIT_QUIZ:
                render = <QuizPreview content={slide.content} sendAnalyticsToBackend={this.handleQuizSumbit.bind(this)}/>
                break;
            case globals.EDIT_GAME:
                render = <GameView url={slide.content.url}/>
                break;
            case globals.EDIT_HYPERVIDEO:
                render = <HyperVideoEdit value={slide.content} preview={true}/>
                break;
            case globals.EDIT_SYSTEM:
                render = <GameView value={slide.content} preview={true}/>
                break;
            default:
                return (<div key={idx}>not yet implemented ☹️</div>)
        }

        return render
    }

    updateTiming() {
        const t1 = this.state.lastTime;
        const t2 = new Date();
        var newelement = {i: this.state.slideIdx, t: t2 - t1};
        var newArr = [...this.state.timing, newelement]

        this.setState({
          timing: newArr
        })

        let tobj = {
            startTime: this.state.startTime,
            timing: newArr,
            lastTime: t2
        }
        this.setState({
            lastTime:t2
        })
        return tobj
    }

    postInteractionData(timeObj) {
        console.log(this.props.authUser.displayName);
        const data = {
            "accessTimes": timeObj.timing,
            "startTime": timeObj.startTime,
            "endTime": timeObj.endTime,
            "contentId": this.state.content.contentId,
            "accessUserId": this.props.authUser.displayName,
            "accessUserUID": this.props.authUser.uid,
            "contentUserId": this.state.content.userId
        }

        if(this.props.authUser && this.props.authUser.displayName){
            this.props.authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
               api.postUserContentAccess(data, idToken);
            }).catch(function(error) {
              console.log(error);
            });
        }
        else{
            api.postUserContentAccess(data, "");
        }

    }

    postQuizData(quizObj) {
        console.log(this.props.authUser.displayName);
        const data = {
            "startTime": quizObj.startTime,
            "endTime": quizObj.endTime,
            "contentId": this.state.content.contentId,
            "accessUserId": this.props.authUser.displayName,
            "accessUserUID": this.props.authUser.uid,
            "contentUserId": this.state.content.userId,
            "quizzes" : quizObj.quizzes,
            "type" : "quizUpdate"
        }
        

        if(this.props.authUser && this.props.authUser.displayName){
            this.props.authUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
               api.postUserContentAccess(data,idToken);
            }).catch(function(error) {
              console.log(error);
            });
        }
        else{
            api.postUserContentAccess(data,"");
        }
    }

    handleQuizSumbit(isCorrect){

        var answer = isCorrect;
        const t1 = this.state.lastTime;
        const t2 = new Date();

        var newelement = {i: this.state.slideIdx, correct: isCorrect, t: t2 - t1};
        var newArr = [...this.state.quizzes, newelement]

        this.setState({
          quizzes: newArr
        })


        let endTime = new Date();
        var quizObj = {
            startTime: this.state.startTime,
            endTime: endTime,
            quizzes: newArr,
        }
        this.postQuizData(quizObj);
    }

    handleNext() {
        let idx = this.state.slideIdx + 1;
        let tobj = this.updateTiming();
        this.setState({slideIdx: idx});
        let endTime = null;
        if (idx === this.state.content.data.length - 1) {
            endTime = new Date();
            tobj.endTime = endTime;
            this.setState(tobj);
        } else {
            tobj.endTime = this.state.endTime;
        }
        this.postInteractionData(tobj);
    }

    handlePrevious() {
        let tobj = this.updateTiming();
        tobj.endTime = this.state.endTime;
        this.setState({
            slideIdx: this.state.slideIdx - 1,
        });
        this.postInteractionData(tobj);
    }

    handleStepChange(newStep) {
        this.setState({
            slideIdx: newStep
        })
    }

    render() {
        if (!this.state.hasLoaded) {
            return <center><CircularProgress style={{color: 'orange'}} thickness={7}/></center>
        }

        const content = this.state.content;
        if (!content) {
            return <NotFoundPage/>
        }

        console.log('slide idx', this.state.slideIdx)
        let fullScreen;
        if (this.state.slideIdx < content.data.length) {
            const type = content.data[this.state.slideIdx].type;
            fullScreen = (type === globals.EDIT_GAME || type === globals.EDIT_SYSTEM)
        }
        return (
            <div>
            <center>

            <Media query="(max-width: 768px)">
                    {matches =>
                      matches ? (
                            <SwipeableViews
                    axis={'x'}
                    index={this.state.slideIdx}
                    onChangeIndex={this.handleStepChange.bind(this)}
                    enableMouseEvents
                    animateHeight={true}
                    style={{
                        width: fullScreen ? window.width : '90%', marginTop: '20px',
                        minHeight: window.innerHeight * 0.82
                    }}
                >
                {content.data.map((slide, idx) =>
                        (<section key={slide.identifier}>
                            {this.whatRenderer(slide, idx)}

                            {/*<CoolBlueButton size="small" onClick={() => this.toggle('showComments')}>*/}
                                {/*{this.state.showComments ? "Hide" : "Show"} {" Comments"}*/}
                            {/*</CoolBlueButton>*/}

                            {/*{this.state.showComments ?*/}
                                {/*<Comment key={slide.identifier} name={this.authUsername} slideNumber={this.state.slideIdx}*/}
                                         {/*slideLength={this.contentLength}/>*/}
                                {/*: null*/}
                            {/*}*/}
                        </section>)
                    )}
                    {this.props.authUser
                        ? <Rating user={this.props.authUser}/>
                        : null
                    }

                    ))}

                </SwipeableViews>

                      ) : (
                      <SwipeableViews
                    axis={'x'}
                    index={this.state.slideIdx}
                    onChangeIndex={this.handleStepChange.bind(this)}
                    enableMouseEvents
                    animateHeight={true}
                    style={{
                        width: fullScreen ? window.width : '75%', marginTop: '20px',
                        minHeight: window.innerHeight * 0.82
                    }}
                >
                {content.data.map((slide, idx) =>
                        (<section key={slide.identifier}>
                            {this.whatRenderer(slide, idx)}

                            {/*<CoolBlueButton size="small" onClick={() => this.toggle('showComments')}>
                                {this.state.showComments ? "Hide" : "Show"} {" Comments"}
                            </CoolBlueButton>*/}

                            {/*{this.state.showComments ?*/}
                                {/*<Comment key={slide.identifier} name={this.authUsername} slideNumber={this.state.slideIdx}*/}
                                         {/*slideLength={this.contentLength}/>*/}
                                {/*: null*/}
                            {/*}*/}
                        </section>)
                    )}
                    {this.props.authUser
                        ? <Rating error={this.showSnackBarError.bind(this)} user={this.props.authUser}/>
                        : null
                    }

                    ))}

                </SwipeableViews>

                      )
                    }
                  </Media>
                    
                <MobileStepper steps={content.data.length + 1}
                               activeStep={this.state.slideIdx}
                               style={{
                                   position: 'relative',
                                   bottom: '0',
                                   width: '100%',
                                   minHeight: 12 + "vh"
                               }}
                               nextButton={
                                   <Button size="large"
                                           style={this.state.slideIdx === content.data.length ? null : buttonStyle}
                                           onClick={this.handleNext.bind(this)}
                                           disabled={this.state.slideIdx === content.data.length}>
                                       Next
                                       {<KeyboardArrowRight/>}
                                   </Button>
                               }
                               backButton={
                                   <Button size="large"
                                           style={this.state.slideIdx === 0 ? null : buttonStyle}
                                           onClick={this.handlePrevious.bind(this)}
                                           disabled={this.state.slideIdx === 0}>
                                       {<KeyboardArrowLeft/>}
                                       Back
                                   </Button>
                               }
                />
            </center>
            <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={this.state.showSnackBar}
                  autoHideDuration={6000}
                  onClose={this.closeSnackBar.bind(this)}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{this.state.snackBarMessage}</span>}
                  action={[
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      onClick={this.closeSnackBar.bind(this)}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
                </div>
        )
    }
}

export default ContentView;
