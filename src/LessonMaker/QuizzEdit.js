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
class FormulaEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN]


    constructor(props) {
        super(props);
        this.state = {
            isInEditMode: false,
        	question: props.data.question,
            answers: props.data.answers,
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

    onSelectAction(action) {

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

            const answers = this.state.answers;
            answers[this.state.selectingImageForIndex].image = reader.result;
            this.setState({ 
                answers: answers
            }); 
        }

        reader.readAsDataURL(file);
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
            elementWidth = "40%";
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
                {this.state.question}
                <center>
            	<div style={containerStyle}>
                   
            	   {this.state.answers.map(function(answer, index) {
                    const quizAnswerOptionStyle = {
                        boxShadow: "1px 1px #AAAAAA",
                        borderRadius: "6px 6px 6px 6px",
                        margin: '2px',
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
                <InputGroup style={{marginBottom: '20px'}}>
                    <InputGroupAddon addonType="prepend">?</InputGroupAddon>
                    <Input placeholder="i haz asked you what the quesion is?" value={this.state.question} />
                    <InputGroupAddon addonType="append"><Button color="secondary" onClick={that.onShowImageSelectionDialog.bind(that)}>{ICON("icon-camera")}</Button></InputGroupAddon>
                </InputGroup>
                    {this.state.answers.map(function(answer, index) {
                        return (
                            <div style={{marginBottom: '20px'}}>

                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <Input addon type="radio" name="radio1"/>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="entr you answer" value={answer.title} />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={function() { that.onShowImageSelectionDialog(index) }}>
                                    {ICON("icon-camera")}
                                    </Button>
                                </InputGroupAddon>
                                
                                <SelectionDropdown onSelect={that.onSelectAction.bind(that)} default={"No Action"} options={["Go to Chatper 1", "Go to Chapter 2", "Go to Chapter 3"]}/>

                            </InputGroup>
                            {answer.image!=""? (
                                <center>
                                    <img src={answer.image} style={{maxWidth:'200px'}} />
                                </center>
                                ) : null}
                            
                            <Input placeholder="Answer feedback or hint (optional)." value={answer.hint} />
                            </div>
                            )
                    })}
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

FormulaEdit.modules = {
    toolbar: null
}

FormulaEdit.propTypes = {
    isEditable: PropTypes.bool
}

export default FormulaEdit;
