import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import api from '../api'
// import globals from '../globals'

/*
const ICON = function(className, fontSize=globals.ICON_FONTSIZE_MIDDLE) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
}
*/

//this is the new "Preview" Component
class ImageEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	imageUrl: null
        }
    }

    searchTerm = null;

	onClickButton() {


		const that = this;

		this.setState({
				imageUrl: null
		}, function() {
			api.getGifsForSearch(this.searchTerm).then(function(result) {
				that.setState({
					imageUrl: result[0]
				});
			});
		});
	}

	onChangedSearchTerm(element) {
		this.searchTerm = element.target.value;
	}
	
    render() {
    	
        return (
            <div>
            	<InputGroup>
			        <InputGroupAddon addonType="prepend">🖼</InputGroupAddon>
			        <Input placeholder="search term" onChange={this.onChangedSearchTerm.bind(this)}/>
		        </InputGroup>
		        <Button color="primary" onClick={this.onClickButton.bind(this)}>Search GIFs</Button>
            	<center>
            	{this.state.imageUrl? <img src={this.state.imageUrl} alt=""/> : <img src="https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""/>}
            	
            	</center>
            </div>
        )
    }
}

ImageEdit.modules = {
    toolbar: null
}

ImageEdit.propTypes = {
    isEditable: PropTypes.bool
}

export default ImageEdit;
