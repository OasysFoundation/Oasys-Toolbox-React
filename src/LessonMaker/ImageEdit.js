import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import api from '../api'

import ImageSelectionModal from './ImageSelectionModal'

import { GridLoader } from 'react-spinners';

import {saveToSessionStorage} from '../utils/trickBox'

import ProgressiveImage from 'react-progressive-image';

//this is the new "Preview" Component
class ImageEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	imageUrl: this.props.data.imageUrl,
            showsImageSelectionPopover: false,
            images: [],
            gifs: [],
            didStartSearch: false
        }
    }

    saveCurrentState() {
        saveToSessionStorage(this.props.id, {
            imageUrl: this.state.imageUrl
        });
    }

    searchTerm = null;

	onClickButton() {

		const that = this;

		this.setState({
				imageUrl: null,
                didStartSearch: true,
                showsImageSelectionPopover: true
		}, function() {
			
            const imageCallback = api.getImagesForSearch(this.searchTerm);

            const gifCallback = api.getGifsForSearch(this.searchTerm);

            Promise.all([imageCallback, gifCallback]).then(function(images) {
                that.setState({
                    images: images[0],
                    gifs: images[1]
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

    onSelectImage(image) {
        this.setState({
            imageUrl: image,
            didStartSearch: false
        });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.onClickButton();
        }
    }

    render() {
    	
        return (
            <div>

                {this.props.isEditMode? (
                	<InputGroup style={{marginBottom:'20px'}}>
    			        <InputGroupAddon addonType="prepend">🖼</InputGroupAddon>
    			        <Input placeholder="search term" onChange={this.onChangedSearchTerm.bind(this)} onKeyPress={this.onKeyPress.bind(this)} />
                       <InputGroupAddon addonType="append">
                            <Button color="secondary" onClick={this.onClickButton.bind(this)} >
                            Search
                            </Button>
                        </InputGroupAddon>
    		        </InputGroup> )
                    :
                    null
                }
            	
                <center>

            	{this.state.imageUrl? 
                    (
                        <ProgressiveImage src={this.state.imageUrl} placeholder='https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy-downsized.gif' style={{maxWidth:'550px'}} >
                             {(src) => <img src={src} alt='' style={{maxWidth:'100%'}} />}
                        </ProgressiveImage>
                    ) : <p>Search for GIFs and imgages above.</p>}
                {this.state.didStartSearch? <GridLoader size={30} /> : null}
            	</center>

                <ImageSelectionModal isOpen={this.state.showsImageSelectionPopover} images={this.state.images} gifs={this.state.gifs} onClose={this.closeModalImgageSelection.bind(this)} onSelect={this.onSelectImage.bind(this)} />
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
