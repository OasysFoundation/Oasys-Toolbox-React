import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import HelpIcon from '@material-ui/icons/Help';

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
	            <div><p>We prepared videos and tutorials for you to help you get started with the Oasys Authoing Suite.</p></div>
            </div>
            </center>
			)
	}
}


export default Help;
