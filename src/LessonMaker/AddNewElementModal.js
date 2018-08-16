import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from "../globals";

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import FormulaIcon from '../assets/element_icons/formula.png'
import GameIcon from '../assets/element_icons/game.png'
import ImageIcon from '../assets/element_icons/image.png'
import QuizIcon from '../assets/element_icons/quiz.png'
import SystemIcon from '../assets/element_icons/system.png'
import TextIcon from '../assets/element_icons/text.png'
import VideoIcon from '../assets/element_icons/video.png'

class AddNewElementModal extends Component {

	elementTypes = [
		globals.EDIT_QUILL,
		globals.EDIT_IMAGE,
		globals.EDIT_FORMULA,
		globals.EDIT_QUIZ,
		globals.EDIT_VIDEO,
		globals.EDIT_EMBED
	]
	

	titleForElement(elementType) {
		switch (elementType) {
            case globals.EDIT_QUILL:
                return "Text";
            case globals.EDIT_IMAGE:
                return "Image";
            case globals.EDIT_FORMULA:
                return "Formula";
            case globals.EDIT_QUIZ:
                return "Quiz";
            case globals.EDIT_VIDEO:
                return "Video";
            //case globals.EDIT_GAME:
            //	return "Game";
            case globals.EDIT_EMBED:
            	return "Simulation";
            default:
                return "Yet unknown element."
        }

        return "Yet unknown element."
	}


	iconForElement(elementType) {
		switch (elementType) {
            case globals.EDIT_QUILL:
                return TextIcon;
            case globals.EDIT_IMAGE:
                return ImageIcon;
            case globals.EDIT_FORMULA:
                return FormulaIcon;
            case globals.EDIT_QUIZ:
                return QuizIcon;
            case globals.EDIT_VIDEO:
                return VideoIcon;
            //case globals.EDIT_GAME:
            //	return GameIcon;
            case globals.EDIT_EMBED:
            	return SystemIcon;

            default:
                return null;
        }

        return null;
	}

	onSelectElement(elementType) {
		this.props.onSelectElement(elementType);
	}

    render() {
    	const that = this;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.onClose} backdrop={true}>
		        <ModalHeader toggle={this.props.onClose}>Adding a new Element to this Chapter</ModalHeader>
		          <ModalBody>
		          <div style={{width: "100%", display: "flex", flexWrap: "wrap", flexDirection:"row"}}>
					{this.elementTypes.map(function(elementType,idx) {
						return (
							<div 
                                onClick={function() { that.onSelectElement(elementType) }} 
                                style={{marginBottom:'10px', width:'33%', cursor: "pointer"}}
                                key={idx.toString()}
                            >
								<center>
									<img src={that.iconForElement(elementType)} style={{width:'100%', padding:'10px'}}/>
									<br />
									{that.titleForElement(elementType)}
								</center>
							</div>
							)
					})}	
					</div>
				  </ModalBody>
            </Modal>
        );
    }
}

AddNewElementModal.propTypes = {

};

export default AddNewElementModal;
