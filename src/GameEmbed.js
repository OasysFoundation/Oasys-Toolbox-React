import React, {Component} from 'react';


const XIFrame = (props) =>
	(
		<iframe sandbox="allow-same-origin allow-scripts" seamless src={props.link} frameBorder="0" allowFullScreen> </iframe>
			)

export {XIFrame};