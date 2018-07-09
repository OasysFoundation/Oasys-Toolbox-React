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



class ContentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIdx: 0,
            content: null,
            hasLoaded: false,
            timing: [],
            lastTime: new Date(),
        };

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        const userName = directory[0];
        const contentName = directory[1];

        const APICALL = `https://api.joinoasys.org/user/${userName}/${contentName}/`;

        const that = this;
        fetch(APICALL, {
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            return response.json();
        })
            .then(function (myJson) {
                //WHY IS IT ARRAY IF THERE's ONLY ONE ENTRY?
                console.log("content here: ", myJson[0]);
                that.setState({content: myJson[0], hasLoaded: true})
            });
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > this.state.content.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    whatRenderer(slide) {
        switch(slide.type) {
            case globals.QUILL:
                return <Preview content={slide.content}/>
            case globals.QUIZ:
                return <QuizPreview content={slide.content}/>
            case globals.GAME:
                return <GameView url={slide.content.url}/>
            default:
                return <div>not yet implemented ☹️</div>
        }
    }

    updateTiming() {
        const t1 = this.state.lastTime;
        const t2 = new Date();
        let timing = this.state.timing.slice();
        timing.push(t2-t1);
        this.setState({
            timing: timing,
            lastTime: t2
        })
    }

    handleNext() {
        this.setState({
            slideIdx: this.state.slideIdx+1,
        })
        this.updateTiming();
    }

    handlePrevious() {
        this.setState({
            slideIdx: this.state.slideIdx-1
        });
        this.updateTiming();
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
                <SwipeableViews
                      axis={'x'}
                      index={this.state.slideIdx}
                      onChangeIndex={this.handleStepChange.bind(this)}
                      enableMouseEvents
                    >
                    {content.data.map(slide => (
                        this.whatRenderer(slide)
                    ))}
                    <Rating username={this.props.authUser}/>
                    </SwipeableViews>
                    <MobileStepper
                      steps={content.data.length + 1}
                      activeStep={this.state.slideIdx}
                      style = {{position: 'fixed', bottom: '0', width: '100%'}}
                      nextButton={
                        <Button size="small" onClick={this.handleNext.bind(this)} disabled={this.state.slideIdx === content.data.length}>
                          Next
                          {<KeyboardArrowRight />}
                        </Button>
                      }
                      backButton={
                        <Button size="small" onClick={this.handlePrevious.bind(this)} disabled={this.state.slideIdx === 0}>
                          {<KeyboardArrowLeft />}
                          Back
                        </Button>
                      }
                    />
            </div>
        );
    }
}

export default ContentView;
