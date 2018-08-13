import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import api from '../api'

import ImageSelectionModal from './ImageSelectionModal'

import { GridLoader } from 'react-spinners';

import {saveToSessionStorage} from '../utils/trickBox'

//this is the new "Preview" Component
class ImageEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	imageUrl: this.props.content,
            showsImageSelectionPopover: false,
            images: [],
            didStartSearch: false
        }
    }

    saveCurrentState() {
        saveToSessionStorage(this.props.id, {
            content: this.state.imageUrl
        });
    }

    searchTerm = null;

	onClickButton() {


		const that = this;

		this.setState({
				imageUrl: null,
                didStartSearch: true
		}, function() {
			api.getGifsForSearch(this.searchTerm).then(function(images) {
				that.setState({
					images: images,
                    showsImageSelectionPopover: true
				});
			});
		});
	}

	onChangedSearchTerm(element) {
		this.searchTerm = element.target.value;
	}
	
    closeModalImgageSelection() {
        this.setState({
            showsImageSelectionPopover: false
        });
    }

    onSelectImageAtIndex(index) {
        this.setState({
            imageUrl: this.state.images[index],
            didStartSearch: false
        });
    }

    render() {
    	
        return (
            <div>
            	<InputGroup>
			        <InputGroupAddon addonType="prepend">🖼</InputGroupAddon>
			        <Input placeholder="search term" onChange={this.onChangedSearchTerm.bind(this)}/>
                   <InputGroupAddon addonType="append">
                        <Button color="secondary" onClick={this.onClickButton.bind(this)} >
                        Search
                        </Button>
                    </InputGroupAddon>
		        </InputGroup>
            	
                <center style={{marginTop:'20px'}}>

            	{this.state.imageUrl? <img src={this.state.imageUrl} alt="Image or GIF"/> : <p>Search for GIFs and imgages above.</p>}
                {this.state.didStartSearch? <GridLoader size={30} /> : null}
            	</center>

                <ImageSelectionModal isOpen={this.state.showsImageSelectionPopover} images={this.state.images} onClose={this.closeModalImgageSelection.bind(this)} onSelect={this.onSelectImageAtIndex.bind(this)} />
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
