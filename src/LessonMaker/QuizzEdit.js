import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



import PropTypes from 'prop-types';
import api from '../api'

import colors from '../colors'
import globals from '../globals'

import SelectionDropdown from './SelectionDropdown'

const ICON = function(className, fontSize=globals.ICON_FONTSIZE_NORMAL) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
}

//this is the new "Preview" Component
class QuizzEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN]


    constructor(props) {
        super(props);
        this.state = {
            isInEditMode: false,
        	question: props.data.question? props.data.question : "",
            answers: props.data.answers? props.data.answers : [],
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0
        }
    }

    onClickButton() {
        this.setState({
            isInEditMode: true
        })
    }

    onClose() {
        this.setState({
            isInEditMode: false
        })
    }

    onSelectAnswer(element) {
        console.log({element});
    }

    onSelectAction(answerIndex, chapterIndex) {
        const answers = this.state.answers;
        answers[answerIndex].action = this.props.chapters[chapterIndex].id;

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

    onSelectImage(e, file) {
        var file = file || e.target.files[0],
            pattern = /image-*/,
            reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('Wrong File Format');
            return;
        }

        reader.onload = (e) => {

            if (this.state.selectingImageForIndex == "question") {
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
            "correct": false
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
        const question = this.state.question;
        question.title = newText;
        this.setState({
            question: question
        })
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


        const that = this; 
        return (
            <div>
                <Button color="primary" onClick={this.onClickButton.bind(this)}>Edit Quiz</Button>
                {this.state.question.title}
                <img src={this.state.question.image} />
                <center>
            	<div style={containerStyle}>
                   
            	   {this.state.answers.map(function(answer, index) {
                    
                    const quizAnswerOptionStyle = {
                        boxShadow: "1px 1px #AAAAAA",
                        borderRadius: "6px 6px 6px 6px",
                        padding: '2px',
                        textAlign: "center",
                        alignSelf: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: elementWidth,
                        minHeight: elementHeight,
                        backgroundColor: that.quizColors[index % that.quizColors.length]
                    };

                    return (
                        <div style={quizAnswerOptionStyle} onClick={that.onSelectAnswer.bind(that)}>
                        <div>{answer.title}</div>
                        <div>
                        {answer.image!=""? (
                                <center>
                                    <img src={answer.image} width="100%" style={{onerror: 'this.style.display = "none"', padding:'10px'}}/>
                                </center>
                                ) : null}
                        </div></div>
                        );
                   })}
            	</div>
                </center>


                <input style={{display: "none"}} type="file" accept="image/*" onChange={that.onSelectImage.bind(that)} ref="fileUploader" />

                <Modal isOpen={this.state.isInEditMode} toggle={this.onClose.bind(this)} backdrop={true}>
                  <ModalHeader toggle={this.onClose.bind(this)}>Edit Quiz??????? Gellooo? – Single Choice with Action Option</ModalHeader>
                  <ModalBody>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">?</InputGroupAddon>
                    <Input placeholder="i haz asked you what the quesion is?" value={this.state.question.title} onChange={function(element) { that.onChangeQuestion(element.target.value) }}/>
                    <InputGroupAddon addonType="append"><Button color="secondary" onClick={function() { that.onShowImageSelectionDialog("question") }}>{ICON("icon-camera")}</Button></InputGroupAddon>
                </InputGroup>
                <center>
                <img src={this.state.question.image} style={{maxWidth:'200px', marginBottom:"20px"}} />
                </center>
                    {this.state.answers.map(function(answer, index) {
                        return (
                            <div style={{marginBottom: '20px'}}>

                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <Input addon type="radio" name="radio1" onChange={function(radio) { that.onUpdateCorrectAnswer(radio.target.value, index) } } />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="entr you answer" value={answer.title} onChange={function(element) { that.onChangeAnswer(element.target.value, index) }} />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={function() { that.onShowImageSelectionDialog(index) }}>
                                    {ICON("icon-camera")}
                                    </Button>
                                </InputGroupAddon>
                                
                                <SelectionDropdown onSelect={that.onSelectAction.bind(that)} identifier={index} default={answer.action!=null? that.props.chapters.reduce(function(result, currentChapter) { 
                                    if(currentChapter.id == answer.action) {
                                        return currentChapter;
                                    }
                                    return result; 
                                } ).title : "No Action"} options={that.props.chapters.map(function(element) { return "Go to " + element.title + "…"})}/>

                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={function() { that.onRemoveAnswer(index) }}>
                                    {ICON("icon-trash")}
                                    </Button>
                                </InputGroupAddon>

                            </InputGroup>
                            {answer.image!=""? (
                                <center>
                                    <img src={answer.image} style={{maxWidth:'200px'}} />
                                </center>
                                ) : null}
                            
                            <Input placeholder="Answer feedback or hint (optional)." value={answer.feedback} onChange={function(element) { that.onChangeFeedbackHint(element.target.value, index) }} />
                            </div>
                            )
                    })}
                    <center>
                            <Button color="secondary" onClick={this.onAddNewAnswerOption.bind(this)}>Add new Answer Option</Button>
                    </center>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.onClose.bind(this)}>Cancel</Button>
                    <Button color="primary" onClick={this.onClose.bind(this)}>Save</Button>
                  </ModalFooter>
                </Modal>

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
