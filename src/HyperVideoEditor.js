import React, { Component } from 'react';
import Plyr from 'react-plyr';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactDOM from 'react-dom';
import QuizPreview from './QuizPreview'
import HorizontalSlidePicker from './HorizontalSlidePicker'

let plyr = null;

const defaultQuiz = {
  "question": "",
  "answers": [{"option": "", "correct": false}]
};

class HyperVideoEditor extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	currentTime: 0,
	    	currentQuiz: null,
	    	quizzes: []
	    }
	}

	jump() {
    	plyr.currentTime = 10;
    	plyr.clickToPlay = false;
    	plyr.keyboard = { focused: false, global: false };
    	window.plyr = plyr;
	}

	onChange(content) {
		console.log(content);
	}

	addNewQuizAtCurrentTime() {
		plyr.pause();
		
		plyr.toggleControls(false);


		let newQuiz = defaultQuiz;
		newQuiz.time = plyr.currentTime;
		let quizzes = this.state.quizzes;
		quizzes.push(newQuiz);
		this.setState({
			quizzes: quizzes
		});

		this.refreshCurrentQuiz();
	}

	onChange(content) {
		this.setState({
			quizzes: content
		})
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


		    

		    <Button variant="raised" onClick={this.addNewQuizAtCurrentTime.bind(this)} style={{color: 'black'}} >
	          Insert Quiz at {Math.round(this.state.currentTime)} seconds
	      	</Button>
 	   		</center>
 	   		<HorizontalSlidePicker quizzes={this.state.quizzes} onChange={this.onChange.bind(this)} />
 	   	</div>
 	   	);
	}

	componentDidMount() {

		const player = this.refs.video;
		plyr = player.player;

		const elem = document.createElement('div');
		elem.innerHTML = "";
		elem.id = "overlay-container"
		elem.setAttribute('style',  "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index:1000; pointer-events: all;");
		plyr.elements.container.children[0].append(elem);

		
		plyr.on("timeupdate", event => {
			const instance = event.detail.plyr;
			
			this.setState({
				currentTime: instance.currentTime
			});

			this.refreshCurrentQuiz();
			
		})
	}

	refreshCurrentQuiz() {
		let currentQuiz = null;
		let currentTime = this.state.currentTime;
			this.state.quizzes.forEach(function(quiz) {
				if (currentTime-2 < quiz.time && quiz.time < currentTime+2 ) {
					currentQuiz = quiz;
					console.log("current quiz" + currentQuiz);
				}
			});

			if (currentQuiz != this.state.currentQuiz) {
				console.log("rendering quz");
				this.setState({
					currentQuiz: currentQuiz
				});

				ReactDOM.render((
					
						<Card style={{maxWidth:'450px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', 'z-index':'1000'}} >
						<CardContent>
						<QuizPreview content={this.state.currentQuiz} onChange={this.onChange.bind(this)} />
						</CardContent>
						</Card>
					
				
				), document.getElementById("overlay-container")
				);
			}
	}
}

export default HyperVideoEditor;