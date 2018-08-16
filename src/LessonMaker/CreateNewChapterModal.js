import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputGroup, Input } from 'reactstrap';
import { Button } from 'reactstrap';

class CreateNewChapterModal extends Component {

	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
		this.onCreateNewChapter = this.onCreateNewChapter.bind(this);
	}

	state = {
		newCategoryName: ""
	}

	onCreateNewChapter() {
		this.props.onCreateNewChapter(this.state.newCategoryName);
		this.props.onClose();
		this.setState({
			newCategoryName: ""
		});
	}

	toggle() {
		this.props.onClose();
	}

	onChangeText(element) {
		this.setState({
			newCategoryName: element.target.value
		});
	}

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.toggle} backdrop={true}>
	          <ModalHeader toggle={this.toggle}>Create New Chapter</ModalHeader>
	          <ModalBody>
	          	<InputGroup>
                    <Input placeholder="New Chapter Name" value={this.state.newCategoryName} onChange={this.onChangeText} />
                </InputGroup>
	          </ModalBody>
	          <ModalFooter>
	            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
	            <Button color="primary" onClick={this.onCreateNewChapter}>Create new Chapter</Button>{' '}
	          </ModalFooter>
	        </Modal>
			)
	}
}


export default CreateNewChapterModal;