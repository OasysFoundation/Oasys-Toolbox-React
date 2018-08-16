import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Table } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { GridLoader } from 'react-spinners';
import ProgressiveImage from 'react-progressive-image';

class ImageSelectionModal extends Component {

	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
	}

	state = {
		currentTab: 'imageSelection'
	}

	toggle() {
		this.props.onClose();
	}

	onSelect(image) {
		this.props.onClose();
		this.props.onSelect(image);
	}

	onChangeTab(newTab) {
		this.setState({
			currentTab: newTab
		})
	}

	imageListForCurrentTab() {
		if (this.state.currentTab === 'imageSelection') {
			return this.props.images;
		}
		return this.props.gifs;
	}

	imageSourceDescription() {
		if (this.state.currentTab === 'imageSelection') {
			return "Images from pixabay";
		}
		return "GIFs from GIPHY";
	}

	render() {
		const that = this;


		return (
			<Modal isOpen={this.props.isOpen} toggle={this.toggle} backdrop={true}>
            
			<ModalHeader toggle={this.toggle}>
			<Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.currentTab === 'imageSelection' })}
                  onClick={() => { this.onChangeTab('imageSelection'); }}
                >
                  Images
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.currentTab === 'gifSelection' })}
                  onClick={() => { this.onChangeTab('gifSelection'); }}
                >
                  GIFs
                </NavLink>
              </NavItem>
            </Nav>
			</ModalHeader>
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

export default ImageSelectionModal;