import React, { Component } from 'react';
import Plyr from 'react-plyr';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactDOM from 'react-dom';
import QuizPreview from './QuizPreview'

let plyr = null;

class HyperVideoEditor extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	currentTime: 0
	    }
	}

	jump() {
		
		//player.play();
    	plyr.currentTime = 10;
    	
    	
    	
    	plyr.clickToPlay = false;
    	plyr.keyboard = { focused: false, global: false };
    	window.plyr = plyr;

	}

	onChange(content) {
		console.log(content);
	}

	addOverlay() {
		plyr.pause();

		const elem = document.createElement('div');
		elem.innerHTML = "";
		elem.id = "overlay-container"
		elem.setAttribute('style',  "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index:1000; pointer-events: all;");
		plyr.elements.container.children[0].append(elem);
	    const quizConfig = {
	      "question": "LOREM IPSUM DOLOR SIT AMET",
	      "answers": [{"option": "bla bla bluybb", "correct": true}, {"option": "bla bla bluybb2", "correct": true}],
	    };
		ReactDOM.render((
			<Card style={{maxWidth:'350px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
			<CardContent>
				<QuizPreview content={quizConfig} onChange={this.onChange.bind(this)} />
			</CardContent>
			</Card>
			), document.getElementById("overlay-container")
			);
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
		      videoId="bTqVqk7FSmY"
		      ref="video"
		      clickToPlay= 'false'
		      clickToPause= 'false'
		    />

		    

		    <Button variant="raised" onClick={this.addOverlay.bind(this)} style={{color: 'black'}} >
	          Insert Slide at {Math.round(this.state.currentTime)} seconds
	      	</Button>
 	   		</center>
 	   	</div>
 	   	);
	}

	componentDidMount() {
		const player = this.refs.video;
		plyr = player.player;
		plyr.on("timeupdate", event => {
			const instance = event.detail.plyr;
			this.setState({
				currentTime: instance.currentTime
			});
		})
	}
}

export default HyperVideoEditor;