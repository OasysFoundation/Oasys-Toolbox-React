import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



import PropTypes from 'prop-types';
import api from '../api'

import colors from '../colors'
import globals from '../globals'

import SelectionDropdown from './SelectionDropdown'
import QuizzEditModal from './QuizzEditModal'
import QuizzButton from './QuizzButton'

import {saveToSessionStorage} from '../utils/trickBox'

const ICON = function(className, fontSize=globals.ICON_FONTSIZE_NORMAL) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
}

//this is the new "Preview" Component
class QuizzEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN]


    constructor(props) {
        super(props);
        this.state = {
            showsModalEditor: false,
        	question: props.data.question? props.data.question : "",
            answers: props.data.answers? props.data.answers : [],
            quizType: props.data.quizType? props.data.quizType : "single-choice",
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0,
        }
    }

    onChangeData(data) {
        this.setState({
            question: data.question,
            answers: data.answers,
            quizType: data.quizType
        }, function() {
            saveToSessionStorage(this.props.id, {
                question: this.state.question,
                answers: this.state.answers,
                quizType: this.state.quizType
            });
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

    onSelectAnswer(element) {
        console.log({element});
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
                {this.props.isEditMode? <Button color="primary" onClick={this.onClickEditButton.bind(this)}>Edit Quiz</Button> : null}

                <h1>{this.state.question.title}</h1>
                <img src={this.state.question.image} />
                <center>
            	<div style={containerStyle}>
                   
            	   {this.state.answers.map(function(answer, index) {
                    
                    return <QuizzButton answer={answer} showsSelectionIndicator={that.state.quizType=='multiple-choice'} isSelected={answer.isSelected} index={index} onSelect={that.onSelectAnswer.bind(that)} width={elementWidth} height={elementHeight} color={that.quizColors[index % that.quizColors.length]} />
                   
                   })}

            	</div>
                {this.state.quizType == 'multiple-choice'? <Button color="primary" onClick={this.onClickSubmitButton.bind(this)}>Submit</Button> : null}
                </center>

                <QuizzEditModal question={this.state.question} onAddChapter={this.props.onAddChapter} answers={this.state.answers} quizType={this.state.quizType} onChange={this.onChangeData.bind(this)} onClose={this.onClose.bind(this)} chapters={this.props.chapters} isOpen={this.state.showsModalEditor} />
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
