import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';



class IconSelectionModal extends Component {

	icons = [
		"001-cells.svg",
		"002-capsule.svg",
		"003-flask.svg",
		"004-dropper.svg",
		"005-atom.svg",
		"006-magnet.svg",
		"007-newtons-cradle.svg",
		"008-drops.svg",
		"009-dna.svg",
		"010-cube.svg",
		"011-radiation.svg",
		"012-artificial-intelligence.svg",
		"013-alien.svg",
		"014-molecule.svg",
		"015-flask-1.svg",
		"016-magnifier.svg",
		"017-mad-scientist.svg",
		"018-flying-shoes.svg",
		"019-robot.svg",
		"020-experiments.svg",
		"021-light-bulb.svg",
		"022-test-tubes.svg",
		"023-ufo.svg",
		"024-lighting.svg",
		"025-renewable-energy.svg",
		"026-rocket.svg",
		"027-relativity.svg",
		"028-explosion.svg",
		"029-poison.svg",
		"030-mortar.svg",
		"031-ar-glasses.svg",
		"032-measuring-glass.svg",
		"033-satellite-dish.svg",
		"034-incubator.svg",
		"035-flask-2.svg",
		"036-funnel.svg",
		"037-lab-coat.svg",
		"038-planet.svg",
		"039-syringe.svg",
		"040-science-book.svg",
		"041-calculator.svg",
		"042-hourglass.svg",
		"043-skull.svg",
		"044-gravity.svg",
		"045-fire.svg",
		"046-pills.svg",
		"047-notebook.svg",
		"048-pulse.svg",
		"049-clipboard.svg",
		"050-thermometer.svg"
	]



	render() {
		const that = this;

		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.onClose} backdrop={true}>
            
			<ModalHeader toggle={this.props.onClose}>
				Select Title Icon
			</ModalHeader>
	          <ModalBody>
	          		<center>
	        	 	{this.icons.map(function(iconName) {
	        	 		return <img src={require('../assets/category-icons/'+iconName)} width='100px' style={{margin:'5px', cursor:'pointer'}} onClick={function() { that.props.onSelect(iconName); that.props.onClose(); }} />
	        	 	})}
	        	 	</center>
		      </ModalBody>
			</Modal>
		);
	}
}

export default IconSelectionModal;