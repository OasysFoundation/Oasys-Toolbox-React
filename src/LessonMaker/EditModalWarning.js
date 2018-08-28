import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button  } from 'reactstrap';



class EditModalWarning extends Component {

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.onClose} backdrop={true}>
            
			<ModalHeader toggle={this.props.onClose}>
				Are you planning big changes in "{this.props.contentTitle}"?
			</ModalHeader>
	          <ModalBody>
	          		Analytics, comments, and suggestions <b>might get corrupted</b> if you make fundamental changes in your content.
	          		Fixing typos or adding small explanations should be no problem however. But if you plan to make big changes, consider <i>remixing</i> this content instead.
		      </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.onEditAnyway}>Edit Anyway</Button>
                <Button color="primary" onClick={this.onRemix}>Remix Content</Button>
              </ModalFooter>
			</Modal>
		);
	}
}

export default EditModalWarning;
