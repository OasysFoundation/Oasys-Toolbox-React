import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { Nav, NavItem, NavLink } from 'reactstrap';

import classnames from 'classnames';


import colors from '../colors'
import globals from '../globals'

import uuidv4 from "uuid/v4"

import SelectionDropdown from './SelectionDropdown'
import CreateNewChapterModal from './CreateNewChapterModal'
import mapStoreToProps from "../store/mapStoreToProps";
import actions from "../store/actions";
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
            newChapterCreatedResolver: null
        }

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

    onSave() {
        this.props.onChange({
            question: this.state.question,
            answers: this.state.answers,
            quizType: this.state.quizType,
            actionCorrect: this.state.actionCorrect,
            actionWrong: this.state.actionWrong
        });

        this.props.onClose();
    }

    onClose() {
        this.props.onClose();
    }

    onSelectAction(identifier, chapterIndex) {

        if (chapterIndex >= this.props.chapters.length) {
            console.log("create new chapter!");
            const that = this;
            this.createNewChapter().then(function() {
                that.onSelectAction(identifier, chapterIndex);
            });
            return;
        }

        if (identifier === 'action-correct') {
            this.setState({
                actionCorrect: this.props.chapters[chapterIndex].id
            });
            return;
        }

        if (identifier === 'action-wrong') {
            this.setState({
                actionWrong: this.props.chapters[chapterIndex].id
            });
            return;
        }


        const answers = this.state.answers;
        answers[identifier].action = this.props.chapters[chapterIndex].id;

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

        if (this.state.quizType === 'single-choice') {
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
                    answers: answers
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
        var currentAnswers = this.state.answers;
        currentAnswers[index].feedback = newText;
        this.setState({
            answers: currentAnswers
        })
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

        return this.props.chapters.reduce(function(result, currentChapter) { 
            if (currentChapter.id === identifier) {
                return currentChapter;
            }
            return result; 
        }).title;
    }

    getActionMenuItems() {
        var menuItems = this.props.chapters.map(function(element) { return "Go to " + element.title + "…"});
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
        this.props.onAddChapter(newUuid, newChapterName);
        this.state.newChapterCreatedResolver({
                title: newChapterName,
                identifier: newUuid
        });
    }

	
    render() {
        const that = this; 
        return (
            <div>

                <input style={{display: "none"}} type="file" accept="image/*" onChange={this.onSelectImage} ref="fileUploader" />

                <Modal isOpen={this.props.isOpen} toggle={this.onClose} backdrop={true}>
                
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.quizType === 'single-choice' })}
                          onClick={() => { this.onChangeQuizType('single-choice'); }}
                        >
                          Single Choice Quiz
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.quizType === 'multiple-choice' })}
                          onClick={() => { this.onChangeQuizType('multiple-choice'); }}
                        >
                          Multiple Choice Quiz
                        </NavLink>
                      </NavItem>
                    </Nav>

                  <ModalHeader toggle={this.onClose}>Edit Quiz – {this.state.quizType==='single-choice'? "Single Choice with Selection Options" : "Multiple Choice with Actions"}</ModalHeader>
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
                                    {that.state.quizType==='single-choice'?
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
                                    that.state.quizType==='single-choice'?
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
                            
                            <Input placeholder="Answer feedback or hint (optional). Motivate and help your student." value={answer.feedback} onChange={function(element) { that.onChangeFeedbackHint(element.target.value, index) }} />
                            </div>
                            )
                    })}
                    <center>
                            
                    <Button color="secondary" onClick={this.onAddNewAnswerOption}>Add new Answer Option</Button>
                    {
                        
                        this.state.quizType==='multiple-choice'?
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