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




class ContentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIdx: 0,
            content: null
        };

        const userName = this.props.match.params.username;
        const contentName = this.props.match.params.contentname;

        console.log(userName + "," + contentName);

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
                that.setState({content: myJson[0]})
            });
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > this.state.content.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    whatRenderer(obj) {
        if (this.state.slideIdx >= this.state.content.data.length) {
            return (<Rating />)
        }

        switch(obj.type) {
            case globals.QUILL:
                return <Preview content={obj.content}/>
            case globals.QUIZ:
                return <QuizPreview content={obj.content}/>
            default:
                return <div>not yet implemented ☹️</div>
        }
    }

    handleNext() {
        this.setState({
            slideIdx: this.state.currentlySelectedIndex+1
        })
    }

    handlePrevious() {
        this.setState({
            slideIdx: this.state.currentlySelectedIndex-1
        })
    }

    handleStepChange(newStep) {
        this.setState({
            slideIdx: newStep
        })
    }

    render() {
        const content = this.state.content;
        if (!content) {
            return <div>No Content Found</div>
        }


        const obj = content.data[this.state.slideIdx];


        //TODO >>>>> This is ugly. Make case switch statement that returns the right render component


        const contentDisplayType = this.whatRenderer(obj)

        //<QuizPreview content={obj.content}/>


        //TODO <<<<<

        return (
            <div>
                <SwipeableViews
                      axis={'x'}
                      index={this.state.slideIdx}
                      onChangeIndex={this.handleStepChange.bind(this)}
                      enableMouseEvents
                    >
                   {contentDisplayType}
                    </SwipeableViews>
                    <MobileStepper
                      steps={content.data.length + 1}
                      position="static"
                      activeStep={this.state.slideIdx}
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
