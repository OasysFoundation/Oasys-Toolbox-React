import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddNewElementModal extends Component {

	toggle() {

	}


    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.toggle.bind(this)} backdrop={true}>
		        <ModalHeader toggle={this.toggle.bind(this)}>Select one of thos amazin image.</ModalHeader>
		          <ModalBody>
		          	{this.imageSourceDescription()}
					<Table>
				        <tbody>
				        	{
				        		this.imageListForCurrentTab()? 
				        		(
				        			this.imageListForCurrentTab().map(function(image, index) {
				        			return (<tr>
							            <td><center>
							            <ProgressiveImage src={image} placeholder='https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy-downsized.gif' style={{maxWidth:'350px'}} onClick={function() { that.onSelect(image) }} >
										  {(src) => <img src={src} alt='' style={{maxWidth:'350px'}} onClick={function() { that.onSelect(image) }} />}
										</ProgressiveImage>
							            </center></td>
							        </tr>)
					        		})
				        		)
				        		:
				        		(
				        			<GridLoader size={30} />
				        		)
				        	}
				        </tbody>
				      </Table>
				   </ModalBody>
            </Modal>
        );
    }
}

AddNewElementModal.propTypes = {

};

export default AddNewElementModal;
