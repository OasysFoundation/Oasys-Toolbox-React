import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table } from 'reactstrap';

class ImageSelectionModal extends Component {

	toggle() {
		this.props.onClose();
	}

	onSelect(index) {
		this.props.onClose();
		this.props.onSelect(index);
	}

	render() {
		const that = this;
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.toggle.bind(this)} backdrop={true}>
			<ModalHeader toggle={this.toggle.bind(this)}>Select one of thos amazin image.</ModalHeader>
	          <ModalBody>
				<Table>
			        <tbody>
			        	{
			        		this.props.images.map(function(image, index) {
			        			return (<tr>
						            <td><center><img src={image} style={{maxWidth:'350px'}} onClick={function() { that.onSelect(index) }} /></center></td>
						        </tr>)
			        		})
			        	}
			        </tbody>
			      </Table>
			      </ModalBody>
			</Modal>
		);
	}
}

export default ImageSelectionModal;