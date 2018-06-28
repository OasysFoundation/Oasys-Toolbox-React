import React, { Component } from 'react';
import Plyr from 'react-plyr';

class HyperVideoEditor extends Component {
	constructor(props) {
	    super(props);
	}

	render() {
 	   return (
 	   	<div>
 	   		<center>
 	   		<h1>
 	   			HYPER VIDEO EDITOR
 	   		</h1>
 	   		<Plyr
		      type="youtube" // or "vimeo"
		      videoId="CDFN1VatiJA"
		    />
 	   		</center>
 	   	</div>
 	   	);
	}
}

export default HyperVideoEditor;