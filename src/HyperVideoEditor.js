import React, { Component } from 'react';
import Plyr from 'react-plyr';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactDOM from 'react-dom';
import QuizPreview from './QuizPreview'
import HorizontalSlidePicker from './HorizontalSlidePicker'
import TextField from '@material-ui/core/TextField';

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
	    	quizzes: [],
	    	videoURL: 'https://youtu.be/bBC-nXj3Ng4'
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
		}, function() {
			this.refreshCurrentQuiz();
		})
	}

	didChangeVideoURL(textfield) {
		const url = textfield.target.value;
		console.log(url);
		if (this.isValidYouTubeUrl(url)) {
			this.setState({
				videoURL: '' + url
			});
		}
	}

	isValidYouTubeUrl(url)
	{
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            }
            else {
                return false;
            }
        }
	}

	render() {
 	   return (
 	   	<div id='hyperVideoEditor'>
 	   		<TextField
              id="name"
              placeholder="YouTube URL"
              margin="normal"
              style={{width:'100%', 'margin-bottom': '20px'}}
              onChange={this.didChangeVideoURL.bind(this)}
              helperText="Wrong URL format"
            />
 	   		<center>
 	   		<Plyr
		      type="youtube" // or "vimeo"
		      videoId={this.state.videoURL}
		      ref="video"
		      clickToPlay= {false}
		      clickToPause= {false}
		      controls= {['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']}
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
				}
			});

			if (!(currentQuiz === this.state.currentQuiz)) {
				this.setState({
					currentQuiz: currentQuiz
				}, function() {
							ReactDOM.render((
								<Card style={{maxWidth:'450px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', 'z-index':'1000'}} >
								{this.state.currentQuiz ? (
										<CardContent>
										<QuizPreview content={this.state.currentQuiz} onChange={this.onChange.bind(this)} />
										</CardContent>
									) : (
										<div />
									)}
								</Card>
							
						
						), document.getElementById("overlay-container")
						);
				});
			}
	}
}

export default HyperVideoEditor;