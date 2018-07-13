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
	    	quizzes: this.props.value.quizzes,
	    	videoURL: this.props.value.videoURL,
	    	preview: this.props.preview
	    }
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			quizzes: nextProps.value.quizzes,
	    	videoURL: nextProps.value.videoURL,
	    	preview: nextProps.preview
		});
	}

	onCompletedQuiz() {
		plyr.play();
	}

	refreshCurrentQuiz() {

		let currentQuiz = null;
		let currentTime = this.state.currentTime;
			this.state.quizzes.forEach(function(quiz) {
				if (currentTime-1 < quiz.time && quiz.time < currentTime+1 ) {
					currentQuiz = quiz;
				}
			});

			if (!(currentQuiz === this.state.currentQuiz)) {
				this.setState({
					currentQuiz: currentQuiz
				}, function() {
							if (currentQuiz) {
								plyr.pause();
							}
							ReactDOM.render((
								<Card style={{maxWidth:'450px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', 'z-index':'1000'}} >
								{this.state.currentQuiz ? (
										<CardContent>
										<QuizPreview content={this.state.currentQuiz} onChange={this.onChange.bind(this)} onCompleted={this.onCompletedQuiz.bind(this)} hyperVideoEditing={true}/>
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


	jump() {
    	plyr.currentTime = 10;
    	plyr.clickToPlay = false;
    	plyr.keyboard = { focused: false, global: false };
    	window.plyr = plyr;
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
			this.notifyDelegate();
		})
	}

	notifyDelegate() {
		this.props.onChange({
			"quizzes": this.state.quizzes,
			"videoURL": this.state.videoURL
		});
	}

	componentDidMount() {

		const player = this.refs.video;
		plyr = player.player;

		const elem = document.createElement('div');
		elem.innerHTML = "";
		elem.id = "overlay-container"
		elem.setAttribute('style',  "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index:1000; pointer-events: all;");
		plyr.elements.container.children[0].append(elem);

		plyr.on("seeked", event => {
			this.didUpdateTimeWithEvent(event);
		});

		plyr.on("seeking", event => {
			this.didUpdateTimeWithEvent(event);
		});
		
		plyr.on("timeupdate", event => {
			this.didUpdateTimeWithEvent(event);
		})
	}

	didUpdateTimeWithEvent(event) {
		const that = this;
		const newTime = event.detail.plyr.currentTime;
		that.setState({
			currentTime: newTime
		}, function() {
			that.refreshCurrentQuiz();
		});
	}

	render() {
		return (
			<div>
				<center>
				<Plyr
			      type="youtube" // or "vimeo"
			      videoId={this.state.videoURL}
			      ref="video"
			      clickToPlay= {false}
			      clickToPause= {false}
			      controls= {['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']}
			    />
			    </center>

			    {this.state.preview? 
			    	<div />
			    	:
			    	<div>
			    	<center>
			    	<Button variant="raised" onClick={this.addNewQuizAtCurrentTime.bind(this)} style={{color: 'black'}} >
			          Insert Quiz at {Math.round(this.state.currentTime)} seconds
			      	</Button>
		 	   		</center>
		 	   		<HorizontalSlidePicker quizzes={this.state.quizzes} onChange={this.onChange.bind(this)} />
		 	   		</div>
			    }
		 	</div>
		 )
	}
}

export default HyperVideoEditor;
