import React, { Component } from 'react';
import HelpIcon from '@material-ui/icons/Help';
import Plyr from 'react-plyr';

class Help extends Component {

	constructor(props, {matches}) {
	    super(props);
	}

	render() {
		return(
			<center style={{marginTop:'30px'}}>
			<div style={{maxWidth:'640px'}}>
				<center style={{marginBottom:'40px'}}>
	            <HelpIcon color="secondary" style={{ fontSize: '100px' }}/>
	            <h1>Oasys Authoring Getting Started</h1> 
	            </center>
	            <div style={{margin:'40px'}}><p>We prepared videos and tutorials for you to help you get started with the Oasys Authoing Suite.</p></div>
				<Plyr
			      type="youtube"
			      videoId="https://www.youtube.com/watch?v=9bUtZzi6hag"
			      controls= {['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']}
			    />
            </div>
            </center>
			)
	}
}


export default Help;
