import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import EditorIcon from '@material-ui/icons/BorderColor';

class WelcomeToEditor extends Component {
	
	render() {
		return (
			<div>
				<center style={{marginBottom:'40px'}}>
	                <EditorIcon color="secondary" style={{ fontSize: '100px' }}/>
	                <h1>Welcome to the Oasys Authoring Suite</h1> 
                </center>
                <div><p>Make a difference by teaching others. We take a different approach. Take a look at our contents on our website. Get inspired. Become a teacher yourself. Start today and be rewarded.</p></div>
                <center>
                <Button variant="raised" onClick={this.props.createNewSlide} color="primary" style={{marginTop:'20px'}}>
		        	Create First Slide
	            </Button>
	            </center>
			</div>
			)
	}
}

export default WelcomeToEditor;