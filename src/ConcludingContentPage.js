import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BigLetterRenderer from './BigLetterRenderer'

import Bravocado from './assets/gifs/bravocado.gif'
import GoodJobBoy from './assets/gifs/good_job_boy.gif'
import Otter from './assets/gifs/otter.gif'
import ThumbsUp from './assets/gifs/thumbs_up.gif'


import { Button, Input } from 'reactstrap';
import RatingBar from './RatingBar'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import SocialSharingButtons from './SocialSharingButtons'

// check if emojis are rendered or not
function supportsEmoji() {
  var context = document.createElement("canvas").getContext("2d");
  context.fillText("🖥", -2, 4);
  return context.getImageData(0, 0, 1, 1).data[3] > 0; // Not a transparent pixel
}

class ConcludingContentPage extends Component {

	state = {
		hovered: false,
		selectedRating: null,
		showsFeedbackForm: false,
		randomGif: null
	}

	componentDidMount() {
		this.setState({
			randomGif: this.randomSuccessGif()
		});
	}

	onSelectRating(rating) {
		this.setState({
			selectedRating: null,
			showsFeedbackForm: true
		}, function() {
			this.setState({
				selectedRating: rating
			});
		});
	}

	onCloseFeedbackForm() {
		this.setState({
			showsFeedbackForm: false
		});
	}

	successGifs = [
		Bravocado, GoodJobBoy, Otter, ThumbsUp
	]

	randomSuccessGif() {
		return this.successGifs[Math.floor(Math.random() * this.successGifs.length)];
	}

    render() {
        return (
            <div>
            	<center>


            	<br /><br /><br /> <br />
            	{supportsEmoji()? null : "NO EMOJI SUPPORT DETECTED :( why does your computer not conform to the unicode standard?"}
            	<h1> 👏 Bravo 👏 you've 👏 mastered 👏 this 👏 lesson 👏 </h1>

            	<Button color="primary" style={{marginTop:'20px'}}>Explore more from {this.props.author}</Button>

            	<br />
            	
            	<img src={this.state.randomGif} style={{maxWidth: '100%', marginBottom:'20px', marginTop:'20px'}}/>
            	<br />
				<RatingBar onSelectRating={this.onSelectRating.bind(this)}/>

            	{this.state.selectedRating? 
            	(
    		        <Modal isOpen={this.state.showsFeedbackForm} toggle={this.onCloseFeedbackForm.bind(this)} className={this.props.className}>
			          <ModalHeader toggle={this.onCloseFeedbackForm.bind(this)}>Let {this.props.author} know what you liked and what you didn't!</ModalHeader>
			          <ModalBody>
			          	<center>
				        <BigLetterRenderer value={this.state.selectedRating} />
						</center>
			            <Input type="textarea" placeholder={"Your Feedback for " + this.props.author + "…"} name="text" id="exampleText" style={{minHeight:'100px'}} />
			          </ModalBody>
			          <ModalFooter>
			            <Button color="secondary" onClick={this.onCloseFeedbackForm.bind(this)}>Cancel</Button>
						<Button color="primary" onClick={this.onCloseFeedbackForm.bind(this)}>Submit Feedback</Button>			            
			          </ModalFooter>
			        </Modal>

        		) : null}
				
				<SocialSharingButtons url="https://joinoasys.org" author="Mark22" title="Work" description="This is the best content I've ever made." />

				</center>
            </div>
        );
    }
}

ConcludingContentPage.propTypes = {

};

export default ConcludingContentPage;
