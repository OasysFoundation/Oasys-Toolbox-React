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



                <Modal isOpen={this.state.isInEditMode} toggle={this.onClose.bind(this)}>
                  <ModalHeader toggle={this.onClose.bind(this)}>Edit Quiz Lalalala</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.onClose.bind(this)}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.onClose.bind(this)}>Cancel</Button>
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
