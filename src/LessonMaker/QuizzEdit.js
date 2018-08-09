import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



import PropTypes from 'prop-types';
import api from '../api'

import colors from '../colors'


//this is the new "Preview" Component
class FormulaEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN]

    constructor(props) {
        super(props);
        this.state = {
            isInEditMode: false,
        	question: "how to do?",
            answers: [
                {
                    "title": "1 dudeldi dumm da da",
                    "image": "",
                    "correct": false
                },
                {
                    "title": "2 ladi do dari",
                    "image": "",
                    "correct": false
                },
                {
                    "title": "3 schub di dubidu",
                    "image": "",
                    "correct": false
                },
                {
                    "title": "4 nudelholz",
                    "image": "",
                    "correct": false
                }
            ]
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
	
    render() {

        let flexDirection = 'row';
        let flexWrap = 'nowrap';
        let elementWidth = "25%";
        let elementHeight = "50px";


        const containsLongAnswerText = this.state.answers.reduce(function(result, answer) {
            return result || answer["title"].length > 50;
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
                {this.state.question}
            	<div style={containerStyle}>
            	   {this.state.answers.map(function(answer, index) {
                    return <div style={{textAlign: "center", verticalAlign: "middle", display: "inline-block", width: elementWidth, height: elementHeight, backgroundColor: that.quizColors[index % that.quizColors.length]}}><div>{answer.title}</div></div>;
                   })}
            	</div>



                <Modal isOpen={this.state.isInEditMode} toggle={this.onClose.bind(this)} backdrop={true}>
                  <ModalHeader toggle={this.onClose.bind(this)}>Edit Quiz???????</ModalHeader>
                  <ModalBody>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">?</InputGroupAddon>
                    <Input placeholder="i haz asked you what the quesion is?" value={this.state.question} />
                </InputGroup>
                    {this.state.answers.map(function(answer, index) {
                        return (
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">✓</InputGroupAddon>
                                <Input placeholder="answer text" value={answer.title} />
                                <Button color="primary">🖼</Button>
                            </InputGroup>
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
