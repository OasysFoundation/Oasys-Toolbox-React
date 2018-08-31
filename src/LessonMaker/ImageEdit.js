import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';
import api from '../utils/api'

import ImageSelectionModal from './ImageSelectionModal'

import { GridLoader } from 'react-spinners';

// import {saveToSessionStorage} from '../utils/trickBox'

import ProgressiveImage from 'react-progressive-image';

//this is the new "Preview" Component
class ImageEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	imageUrl: this.props.data? this.props.data.imageUrl : null,
            showsImageSelectionPopover: false,
            images: [],
            gifs: [],
            didStartSearch: false
        }

        this.onChangedSearchTerm = this.onChangedSearchTerm.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
        this.closeModalImgageSelection= this.closeModalImgageSelection.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);

        this.props.onStartLoading();
    }

    saveCurrentState() {
        const data = {imageUrl: this.state.imageUrl};
        this.props.onChange(data, false, true);
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
        }, function() {
            this.saveCurrentState();
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
    			        <Input placeholder="search term" onChange={this.onChangedSearchTerm} onKeyPress={this.onKeyPress} />
                       <InputGroupAddon addonType="append">
                            <Button color="secondary" onClick={this.onClickButton} >
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
                        <img
                          src={this.state.imageUrl}
                          onLoad={this.props.onCompletedLoading}
                          style={{maxWidth:'100%'}}
                        />
                    ) : <p>Search for GIFs and images above.</p>}
                {this.state.didStartSearch? <GridLoader size={30} /> : null}
            	</center>

                <ImageSelectionModal isOpen={this.state.showsImageSelectionPopover} images={this.state.images} gifs={this.state.gifs} onClose={this.closeModalImgageSelection} onSelect={this.onSelectImage} />
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
