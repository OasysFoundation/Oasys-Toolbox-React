import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from "../globals";

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Hypervideo from '../assets/icons/Hypervideo.png'

class AddNewElementModal extends Component {

	elementTypes = [
		globals.EDIT_QUILL,
		globals.EDIT_IMAGE,
		globals.EDIT_FORMULA,
		globals.EDIT_QUIZ,
		globals.EDIT_VIDEO,
		globals.EDIT_EMBED,
		globals.EDIT_SYSTEM
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
            case globals.EDIT_EMBED:
            	return "Iframe";
            case globals.EDIT_SYSTEM:
            	return "System Simulation";

            default:
                return "Yet unknown element."
        }

        return "Yet unknown element."
	}


	iconForElement() {
		return <img src={Hypervideo} />
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
					{this.elementTypes.map(function(elementType) {
						return (
							<div onClick={function() { that.onSelectElement(elementType) }}>
								{that.titleForElement(elementType)}
								{that.iconForElement()}
							</div>
							)
					})}	
				  </ModalBody>
            </Modal>
        );
    }
}

AddNewElementModal.propTypes = {

};

export default AddNewElementModal;
