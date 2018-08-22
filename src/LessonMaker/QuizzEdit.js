import React, { Component } from 'react';


import { Button } from 'reactstrap';

import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';


import PropTypes from 'prop-types';

import colors, {hexToRgba} from '../utils/colors'

import QuizzEditModal from './QuizzEditModal'
import QuizzButton from './QuizzButton'

// import {saveToSessionStorage} from '../utils/trickBox'


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
            answers: props.data? props.data.answers : [ // provides two empty answers as default for new quiz
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
            feedbackPopoverAnchor: null,
            feedbackPopoverText: "",
            feedbackPopoverTitle: "",
            feedbackPopoverAction: null,
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
            }, true, true)
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

        const action = areSelectedOptionsCorrect? this.state.actionCorrect : this.state.actionWrong;

        this.setState({
            feedbackPopoverAnchor: "submit-multiple-choice-button",
            feedbackPopoverText: this.state.generalFeedback,
            feedbackPopoverTitle: feedback,
            feedbackPopoverAction: action
        });
    }

    areSelectedOptionsCorrect() {
        return this.state.answers.reduce(function(currentResult, answer) {
            return currentResult && (answer.correct === answer.isSelected);
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
            feedbackPopoverAnchor: null,
            answers: answers
        }, function() {
            if (this.isSingleChoice()) {
                const selectedAnswer = answers[index];
                this.setState({
                    feedbackPopoverAnchor: 'answer-id-'+index,
                    feedbackPopoverText: selectedAnswer.feedback,
                    feedbackPopoverTitle: selectedAnswer.correct? "Amazing, this is correct!" : "This is wrong…",
                    feedbackPopoverAction: selectedAnswer.action
                });
            }
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

        const that = this; 
        return (
            <div>
                <center>
                {this.props.isEditMode? <Button color="primary" onClick={this.onClickEditButton}>Edit Quiz</Button> : null}
                <h1>{this.state.question.title? this.state.question.title : "This quiz has no question, yet."}</h1>
                {this.state.question.title? null : <p style={{marginBottom:'10px', maxWidth:'350px'}}>Click 'Edit Quiz' to edit the question and answers, and to chose between single choice or multiple choice.</p>}
                <img src={this.state.question.image} alt="" style={{maxWidth:'80%'}}/>
                
            	<div style={gridContainerStyle}>
            	   {this.state.answers.map((answer, index) => {
                    return <QuizzButton 
                                answer={answer} 
                                key={"answer-id-" + index} 
                                id={"answer-id-" + index} 
                                showsSelectionIndicator={that.isMultipleChoice()} 
                                isSelected={answer.isSelected} 
                                index={index} 
                                onSelect={this.onSelectAnswer}
                                color={that.quizColors[index % that.quizColors.length]} 
                            />
                   })}
            	</div>
                {this.isMultipleChoice()? <Button color="primary" id="submit-multiple-choice-button" onClick={this.onClickSubmitButton.bind(this)}>Submit</Button> : null}
                </center>

                {this.state.feedbackPopoverAnchor? 
                (
                  <Popover placement="top" isOpen={Boolean(this.state.feedbackPopoverAnchor)} target={this.state.feedbackPopoverAnchor} toggle={this.onCloseFeedbackPopover}>
                  <PopoverHeader>{ this.state.feedbackPopoverTitle }</PopoverHeader>
                  <PopoverBody>{this.state.feedbackPopoverText}</PopoverBody>
                  <center>
                  <Button color="primary" onClick={function() { that.onContinue(that.state.feedbackPopoverAction) }} style={{marginBottom: '15px'}}> Continue… </Button>
                  </center>
                  </Popover>
                )
                :
                null
                }


                <QuizzEditModal question={this.state.question} answers={JSON.parse(JSON.stringify(this.state.answers))} quizType={this.state.quizType} 
                onChange={this.onChangeData} onClose={this.onClose} chapters={this.props.chapters} isOpen={this.state.showsModalEditor} onAddChapter={this.props.onAddChapter} />
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
