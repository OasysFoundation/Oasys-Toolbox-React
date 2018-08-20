import React, { Component } from 'react';


import { Button } from 'reactstrap';

import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';


import PropTypes from 'prop-types';

import colors from '../colors'

import QuizzEditModal from './QuizzEditModal'
import QuizzButton from './QuizzButton'

import {saveToSessionStorage} from '../utils/trickBox'


//this is the new "Preview" Component
class QuizzEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN];

    constructor(props) {
        super(props);
        this.state = {
            showsModalEditor: false,
        	question: props.data? props.data.question : "",
            answers: props.data? props.data.answers : [
                {
                    "title": "",
                    "image": "",
                    "correct": false,
                    "feedback": "",
                    "action": null,
                    "isSelected": false
                },
                {
                    "title": "",
                    "image": "",
                    "correct": false,
                    "feedback": "",
                    "action": null,
                    "isSelected": false
                }
            ],
            quizType: props.data? props.data.quizType : "single-choice",
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0,
            showsFeedbackPopover: false,
            selectedAnswerIndex: 0,
            generalFeedback: props.data? props.data.feedback : null
        }


        this.onClickEditButton = this.onClickEditButton.bind(this);
        this.onSelectAnswer = this.onSelectAnswer.bind(this);
        this.onClickSubmitButton = this.onClickSubmitButton.bind(this);
        this.onCloseFeedbackPopover = this.onCloseFeedbackPopover.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    onChangeData(data) {
        const that = this;
        this.setState({
            question: data.question,
            answers: data.answers,
            quizType: data.quizType
        }, function() {
            that.props.onChange({
                question: that.state.question,
                answers: that.state.answers,
                quizType: that.state.quizType
            }, true)
        });
    }

    onClickEditButton() {
        this.setState({
            showsModalEditor: true
        })
    }

    onClickSubmitButton() {
        const areSelectedOptionsCorrect = this.areSelectedOptionsCorrect();

        var feedback = ""
        if (areSelectedOptionsCorrect) {
            feedback = "Great, your answer is correct!";
        } else {
            feedback = "This is not quite right."
        }
    }

    areSelectedOptionsCorrect() {
        return this.state.answers.reduce(function(currentResult, answer) {
            return currentResult && (answer.correct == answer.isSelected);
        }, true);
    }

    onClose() {
        this.setState({
            showsModalEditor: false
        });
    }

    onSelectAnswer(index) {

        const answers = this.state.answers;
        answers[index].isSelected = !answers[index].isSelected;


        this.setState({
            showsFeedbackPopover: false,
            answers: answers
        }, function() {
            this.setState({
                selectedAnswerIndex: index,
                showsFeedbackPopover: true
            })
        });
    }

    onCloseFeedbackPopover() {
        this.setState({
            showsFeedbackPopover: false
        });   
    }

    onContinue(nextChapterId) {
        this.onCloseFeedbackPopover();
        this.props.onLearnerInteraction(nextChapterId, this.props.id);
    }

    isSingleChoice() {
        return this.state.quizType === 'single-choice';
    }

    isMultipleChoice() {
        return !this.isSingleChoice();
    }

	
    render() {

        let flexDirection = 'row';
        let flexWrap = 'nowrap';
        let elementWidth = "25%";
        let elementHeight = "50px";


        const containsLongAnswerText = this.state.answers.reduce(function(result, answer) {
            return result || answer["title"].length > 70;
        }
        , 0);

        if (containsLongAnswerText) {
            flexDirection = 'column';
            elementWidth = "100%";
        }


        const containsAtLeastOneImage = this.state.answers.reduce(function(result, answer) {
            return result || answer["image"];
        }
        , 0);

        if (containsAtLeastOneImage) {
            flexWrap = 'wrap';
            elementWidth = "50%";
        }

        const containerStyle = {
            display: "flex",
            flexDirection: flexDirection,
            flexWrap: flexWrap
        }

        const selectedAnswer = this.state.answers ? this.state.answers[this.state.selectedAnswerIndex] : null;
        const feedbackTitle = selectedAnswer? (selectedAnswer.correct ? "You are amazing! This is correct. 🎉" : "Try Again. This is wrong. 😭") : null;

        const that = this; 
        return (
            <div>
                <center>
                {this.props.isEditMode? <Button color="primary" onClick={this.onClickEditButton}>Edit Quiz</Button> : null}
                <h1>{this.state.question.title? this.state.question.title : "This Quiz has no Question, yet."}</h1>
                {this.state.question.title? null : <p style={{marginBottom:'10px', maxWidth:'350px'}}>Click 'Edit Quiz' to edit the question and answers, and to chose between single choice or multiple choice.</p>}
                <img src={this.state.question.image} alt="" style={{maxWidth:'80%'}}/>
                
            	<div style={containerStyle}>
            	   {this.state.answers.map((answer, index) => {
                    return <QuizzButton answer={answer} key={"answer-id-" + index} id={"answer-id-" + index} showsSelectionIndicator={that.isMultipleChoice()} isSelected={answer.isSelected} index={index} onSelect={this.onSelectAnswer} width={elementWidth} height={elementHeight} color={that.quizColors[index % that.quizColors.length]} />
                   })}
            	</div>
                {this.isMultipleChoice()? <Button color="primary" onClick={this.onClickSubmitButton}>Submit</Button> : null}
                </center>

                {this.state.showsFeedbackPopover && this.isSingleChoice()? 
                (
                  <Popover placement="top" isOpen={this.state.showsFeedbackPopover} target={'answer-id-' + this.state.selectedAnswerIndex} toggle={this.onCloseFeedbackPopover}>
                  <PopoverHeader>{ feedbackTitle }</PopoverHeader>
                  <PopoverBody>{this.state.answers.length? this.state.answers[this.state.selectedAnswerIndex].feedback : null}</PopoverBody>
                  <center>
                  <Button color="primary" onClick={function() { that.onContinue(selectedAnswer.action) }} style={{marginBottom: '15px'}}> Continue… </Button>
                  </center>
                  </Popover>
                )
                :
                null
                }


                <QuizzEditModal question={this.state.question} answers={JSON.parse(JSON.stringify(this.state.answers))} quizType={this.state.quizType} 
                onChange={this.onChangeData} onClose={this.onClose} chapters={this.props.chapters} isOpen={this.state.showsModalEditor} />
            </div>
        )
    }
}

QuizzEdit.modules = {
    toolbar: null
}

QuizzEdit.propTypes = {
    isEditable: PropTypes.bool
}

QuizzEdit.defaultProps = {
    answers: [],
    question: ""
}

export default QuizzEdit;
