import React, { Component } from 'react';


import { Button } from 'reactstrap';

import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';


import PropTypes from 'prop-types';

import colors, {hexToRgba} from '../colors'

import QuizzEditModal from './QuizzEditModal'
import QuizzButton from './QuizzButton'

import {saveToSessionStorage} from '../utils/trickBox'


//this is the new "Preview" Component
class QuizzEdit extends Component {

    quizColors = [
        hexToRgba(colors.MOUNTBATTEN, 0.8), 
        hexToRgba(colors.PURPLE, 0.8), 
        hexToRgba(colors.RUST, 0.8), 
        hexToRgba(colors.VELVET, 0.8)
    ];

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
            selectedAnswerIndex: 0
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
        
    }

    onClose() {
        this.setState({
            showsModalEditor: false
        })
    }

    onSelectAnswer(index) {

        this.setState({
            showsFeedbackPopover: false
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

	
    render() {

        let gridTemplateColumns = '47% 47%';


        const containsLongAnswerText = this.state.answers.reduce(function(result, answer) {
            return result || answer["title"].length > 70;
        }
        , 0);

        if (containsLongAnswerText) {
            gridTemplateColumns = '94%';
        }

        const gridContainerStyle = {
            display: 'grid',
            gridAutoRows: '1fr',
            gridTemplateColumns: gridTemplateColumns,
            alignItems: 'center',
            rowGap: '10px',
            columnGap: '10px',
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
                
            	<div style={gridContainerStyle}>
            	   {this.state.answers.map((answer, index) => {
                    return <QuizzButton 
                                answer={answer} 
                                key={"answer-id-" + index} 
                                id={"answer-id-" + index} 
                                showsSelectionIndicator={that.state.quizType==='multiple-choice'} 
                                isSelected={answer.isSelected} 
                                index={index} 
                                onSelect={this.onSelectAnswer}
                                color={that.quizColors[index % that.quizColors.length]} 
                            />
                   })}
            	</div>
                {this.state.quizType === 'multiple-choice'? <Button color="primary" onClick={this.onClickSubmitButton}>Submit</Button> : null}
                </center>

                {this.state.showsFeedbackPopover && this.state.quizType=='single-choice'? 
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


                <QuizzEditModal question={this.state.question} answers={this.state.answers} quizType={this.state.quizType} 
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
