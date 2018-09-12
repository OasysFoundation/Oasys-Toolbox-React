import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { Nav, NavItem, NavLink } from 'reactstrap';

import classnames from 'classnames';


import colors from '../../../utils/colors'
import globals from '../../../utils/globals'

import uuidv4 from "uuid/v4"

import SelectionDropdown from '../../SelectionDropdown'
import CreateNewChapterModal from '../../CreateNewChapterModal'
import mapStoreToProps from "../../../store/mapStoreToProps";
import actions from "../../../store/actions";
import {connect} from "redux-zero/react";
const ICON = function(className, fontSize=globals.ICON_FONTSIZE_NORMAL) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
}

class QuizzEditModal extends Component {


    constructor(props) {
        super(props);
        this.state = {
        	question: props.question? props.question : "",
            answers: props.answers? props.answers : [],
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0,
            quizType: props.quizType? props.quizType : "single-choice",
            actionCorrect: props.actionCorrect? props.actionCorrect : null,
            actionWrong: props.actionWrong? props.actionWrong : null,
            showsCreateNewChapterDialog: false,
            newChapterCreatedResolver: null,
            userCreatedChapters: [],
            generalFeedback: props.generalFeedback? props.generalFeedback : ""
        };

        this.baseState = JSON.parse(JSON.stringify(this.state));

        this.onSelectImage = this.onSelectImage.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSelectAction = this.onSelectAction.bind(this);
        this.onAddNewAnswerOption = this.onAddNewAnswerOption.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseNewChapterCreationDialog = this.onCloseNewChapterCreationDialog.bind(this);
        this.onSelectAction = this.onSelectAction.bind(this);
        this.onCreateNewChapter = this.onCreateNewChapter.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            question: nextProps.question? nextProps.question : "",
            answers: nextProps.answers? nextProps.answers : [],
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0,
            quizType: nextProps.quizType? nextProps.quizType : "single-choice",
            actionCorrect: nextProps.actionCorrect? nextProps.actionCorrect : null,
            actionWrong: nextProps.actionWrong? nextProps.actionWrong : null,
            showsCreateNewChapterDialog: false,
            newChapterCreatedResolver: null,
            userCreatedChapters: [],
            generalFeedback: nextProps.generalFeedback? nextProps.generalFeedback : ""
        });

        this.baseState = JSON.parse(JSON.stringify(this.state));
    }



    onSave() {
        this.props.handleChange({
            question: this.state.question,
            answers: this.state.answers,
            quizType: this.state.quizType,
            actionCorrect: this.state.actionCorrect,
            actionWrong: this.state.actionWrong,
            generalFeedback: this.state.generalFeedback
        });

        const that = this;
        this.state.userCreatedChapters.forEach(function(chapter) {
            that.props.handleAddChapter(chapter.id, chapter.title);
        });

        this.setState({
            userCreatedChapters: []
        });

        this.props.onClose();
    }

    onClose() {
        this.setState(this.baseState, function() {
            this.props.onClose();    
        });
    }

    onSelectAction(identifier, chapterIndex) {

        if (chapterIndex >= this.getAllChapters().length) {
            const that = this;
            this.createNewChapter().then(function(newChapter) {
                const newChapterIndex = that.chapterIndexForIdentifier(newChapter.id);
                that.onSelectAction(identifier, newChapterIndex);
            });
            return;
        }

        if (identifier === 'action-correct') {
            this.setState({
                actionCorrect: this.getAllChapters()[chapterIndex].id
            });
            return;
        }

        if (identifier === 'action-wrong') {
            this.setState({
                actionWrong: this.getAllChapters()[chapterIndex].id
            });
            return;
        }

        const answers = this.state.answers;
        answers[identifier].action = this.getAllChapters()[chapterIndex].id;

        this.setState({
            answers: answers
        });
    }

    onShowImageSelectionDialog(index) {
        this.setState({
            selectingImageForIndex: index
        })
        this.refs.fileUploader.click();
    }

    onUpdateCorrectAnswer(value, index) {

        const answers = this.state.answers;

        if (this.isSingleChoice()) {
            if (value === "on") {
                answers.map(function(answer, answerIndex) {
                    if (answerIndex === index) {
                        answer.correct = true;
                    } else {
                        answer.correct = false;
                    }
                    return answer;
                });

                this.setState({
                    answers: answers
                });
            }
        } else {
            answers[index].correct = !answers[index].correct;
            this.setState({
                fanswers: answers
            });
        }
        
    }

    onSelectImage(e, file) {
        file = file || e.target.files[0];
        var pattern = /image-*/,
            reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('Wrong File Format');
            return;
        }

        reader.onload = (e) => {

            if (this.state.selectingImageForIndex === "question") {
                const question = this.state.question;
                question.image = reader.result;
                this.setState({
                    question: question
                })
            } else {
                const answers = this.state.answers;
                answers[this.state.selectingImageForIndex].image = reader.result;
                this.setState({ 
                    answers: answers
                }); 
            }
        }

        reader.readAsDataURL(file);

    }

    onAddNewAnswerOption() {
        var currentAnswers = this.state.answers;
        currentAnswers.push({
            "title": "",
            "image": "",
            "correct": false,
            "isSelected": false
        });
        this.setState({
            answers: currentAnswers
        })
    }

    onRemoveAnswer(index) {
        var currentAnswers = this.state.answers;
        currentAnswers.splice(index, 1)
        this.setState({
            answers: currentAnswers
        })
    }

    onChangeAnswer(newText, index) {
        var currentAnswers = this.state.answers;
        currentAnswers[index].title = newText;
        this.setState({
            answers: currentAnswers
        })
    }

    onChangeFeedbackHint(newText, index) {

        if (index === 'generalFeedback') {
            this.setState({
                generalFeedback: newText
            });
        } else {
            var currentAnswers = this.state.answers;
            currentAnswers[index].feedback = newText;
            this.setState({
                answers: currentAnswers
            });
        }
    }

    onChangeQuestion(newText) {
        var question = {...this.state.question};
        question.title = newText;
        this.setState({
            question: question
        })
    }


    onChangeQuizType(newQuizType) {

        // ensure that only one answer is marked as corect for single choice (simply the first one)
        if (newQuizType === 'single-choice') {
            const answers = this.state.answers;
            var hasFoundCorrectAnswer = false;
            answers.map(function(answer) {
                if (answer.correct && !hasFoundCorrectAnswer) {
                    hasFoundCorrectAnswer = true;
                } else {
                    answer.correct = false;
                }
                answer.isSelected = false;
                answers.feedback = answers.feedback? answers.feedback : "";
                return answer;
            })

            this.setState({
                answers: answers
            });
        }

        this.setState({
            quizType: newQuizType
        });
    }

    chapterTitleForIdentifier(identifier) {
        return this.getAllChapters().reduce(function(result, currentChapter) { 
            if (currentChapter.id === identifier) {
                return currentChapter;
            }
            return result; 
        }, {}).title;
    }

    chapterIndexForIdentifier(identifier) {
        var chapterIndex = null;
        this.getAllChapters().forEach(function(chapter, index) {
            if (chapter.id === identifier) {
                chapterIndex = index;
            }
        });
        return chapterIndex;
    }

    getAllChapters() {
        const that = this;
        return this.state.userCreatedChapters.concat(this.props.chapters.filter(function(element, index) {
            return index!==that.props.activeChapterIndex;
        }));
    }

    getActionMenuItems() {
        var menuItems = this.getAllChapters().map(function(element) { return "Go to " + element.title + "…"});
        menuItems.push("Create new Chapter…");
        return menuItems;
    }


    createNewChapter() {
        this.setState({
            showsCreateNewChapterDialog: true
        });
        const that = this;
        return new Promise(function(resolve, reject) {
            that.setState({
                newChapterCreatedResolver: resolve
            });
        })
    }

    onCloseNewChapterCreationDialog() {
        this.setState({
            showsCreateNewChapterDialog: false
        });
    }

    onCreateNewChapter(newChapterName) {
        const newUuid = uuidv4();
            
        const userCreatedChapters = this.state.userCreatedChapters;
        userCreatedChapters.push({
            title: newChapterName,
            id: newUuid
        });

        this.setState({
            userCreatedChapters: userCreatedChapters
        }, function() {
            this.state.newChapterCreatedResolver({
                title: newChapterName,
                id: newUuid
            });
        });
    }

    isSingleChoice() {
        return this.state.quizType === 'single-choice';
    }

    isMultipleChoice() {
        return !this.isSingleChoice();
    }

	
    render() {
        const that = this; 
        return (
            <div>

                <input style={{display: "none"}} type="file" accept="image/*" onChange={this.onSelectImage} ref="fileUploader" onKeyUp={function(e){if(e.keyCode===27) this.blur(),e.stopPropagation()}}/>

                <Modal isOpen={this.props.isOpen} toggle={this.onClose} backdrop={true}>
                
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.isSingleChoice() })}
                          onClick={() => { this.onChangeQuizType('single-choice'); }}
                        >
                          Single Choice Quiz
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.isMultipleChoice() })}
                          onClick={() => { this.onChangeQuizType('multiple-choice'); }}
                        >
                          Multiple Choice Quiz
                        </NavLink>
                      </NavItem>
                    </Nav>

                  <ModalHeader toggle={this.onClose}>Edit Quiz – {this.isSingleChoice()? "Single Choice with Selection Options" : "Multiple Choice with Actions"}</ModalHeader>
                  <ModalBody>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">?</InputGroupAddon>
                    <Input placeholder="Add your Question…" value={this.state.question.title} onChange={function(element) { that.onChangeQuestion(element.target.value) }}/>
                    <InputGroupAddon addonType="append"><Button color="secondary" onClick={function() { that.onShowImageSelectionDialog("question") }}>{ICON("icon-camera")}</Button></InputGroupAddon>
                </InputGroup>
                <center>
                <img src={this.state.question.image} style={{maxWidth:'200px', marginBottom:"20px"}} alt="" />
                </center>
                    {this.state.answers.map((answer, index) => {
                        return (
                            <div style={{marginBottom: '20px'}} key={"i-dont-want-to-do-this-"+index}>

                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText style={{'backgroundColor': answer.correct? colors.TURQUOISE : null}}>
                                    {that.isSingleChoice()?
                                        <Input addon checked={answer.correct? "checked" : null} type="radio" name="radio1" onChange={function(radio) { that.onUpdateCorrectAnswer(radio.target.value, index) } } />
                                        :
                                        <Input addon checked={answer.correct? "checked" : null} type="checkbox" onClick={function(checkbox) { that.onUpdateCorrectAnswer(null, index) } } />
                                    }
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input style={{'backgroundColor': answer.correct? colors.TURQUOISE : null}} placeholder={"Answer Option " + (index+1)} value={answer.title} onChange={function(element) { that.onChangeAnswer(element.target.value, index) }} />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={function() { that.onShowImageSelectionDialog(index) }}>
                                    {ICON("icon-camera")}
                                    </Button>
                                </InputGroupAddon>
                                
                                {
                                    that.isSingleChoice()?
                                    (<SelectionDropdown onSelect={this.onSelectAction} identifier={index} default={answer.action!=null? that.chapterTitleForIdentifier(answer.action) : "No Action"} options={that.getActionMenuItems()}/>)
                                :
                                    null
                                }
                                

                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={function() { that.onRemoveAnswer(index) }}>
                                    {ICON("icon-trash")}
                                    </Button>
                                </InputGroupAddon>

                            </InputGroup>
                            {answer.image!==""? (
                                <center>
                                    <img src={answer.image} style={{maxWidth:'200px'}} alt="" />
                                </center>
                                ) : null}
                            {this.isSingleChoice() ?
                            <Input placeholder="Answer feedback or hint (optional). Motivate and help your student." value={answer.feedback} onChange={function(element) { that.onChangeFeedbackHint(element.target.value, index) }} />
                            :
                            null}
                            
                            </div>
                            )
                    })}
                    <center>
                    <Button color="secondary" style={{marginBottom:'20px'}} onClick={this.onAddNewAnswerOption}>Add new Answer Option</Button>

                    {this.isMultipleChoice() ?
                        <Input placeholder="Feedback or hint after the student submitted their solution (optional)." value={that.state.generalFeedback} onChange={function(element) { that.onChangeFeedbackHint(element.target.value, 'generalFeedback') }} />
                        :
                    null}

                    
                    {
                        
                        this.isMultipleChoice()?
                        (   
                            <div style={{marginTop:'20px'}}>
                                <SelectionDropdown onSelect={this.onSelectAction} identifier={"action-correct"} default={this.state.actionCorrect? "When correct: " + this.chapterTitleForIdentifier(this.state.actionCorrect) : "When answered correctly…"} options={this.getActionMenuItems()}/>
                                <br />
                                <SelectionDropdown onSelect={this.onSelectAction} identifier={"action-wrong"} default={this.state.actionWrong? "When wrong: " + this.chapterTitleForIdentifier(this.state.actionWrong) : "When answered wrong…"} options={this.getActionMenuItems()} />
                            </div>
                        )
                    :
                        null
                    }

                    </center>

                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.onClose}>Cancel</Button>
                    <Button color="primary" onClick={this.onSave}>Save</Button>
                  </ModalFooter>
                </Modal>

                <CreateNewChapterModal isOpen={this.state.showsCreateNewChapterDialog} onClose={this.onCloseNewChapterCreationDialog} onCreateNewChapter={this.onCreateNewChapter} />
            </div>
        )
    }
}

//only take what you need
export default connect(mapStoreToProps, actions)(QuizzEditModal);
