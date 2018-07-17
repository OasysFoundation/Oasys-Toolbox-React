import React, { Component } from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';

import QuizEdit from './QuizEdit'


const defaultQuiz = {
	"question": "",
	"answers": [{"option": "", "correct": true}],
};

class HorizontalSlidePicker extends Component {
	constructor(props) {
	    super(props);
		this.state = {
			currentlySelectedIndex: this.props.currentlySelectedIndex,
			quizzes: this.props.quizzes
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			quizzes: nextProps.quizzes
		});
	}

	handleNext() {
		this.setState({
			currentlySelectedIndex: this.state.currentlySelectedIndex+1
		})
	}

	handlePrevious() {
		this.setState({
			currentlySelectedIndex: this.state.currentlySelectedIndex-1
		})
	}

	handleStepChange(newStep) {
		this.setState({
			currentlySelectedIndex: newStep
		})
	}

	onChange(content) {
		this.props.quizzes[this.state.currentlySelectedIndex] = content;
		this.props.onChange(this.state.quizzes);
	}


	render() {
		return (
			<div>
        		<MobileStepper
		          steps={this.state.quizzes.length}
		          position="static"
		          activeStep={this.state.currentlySelectedIndex}
		          nextButton={
		            <Button size="small" onClick={this.handleNext.bind(this)} disabled={this.state.currentlySelectedIndex >= this.state.quizzes.length - 1}>
		              Next Quiz
		              {<KeyboardArrowRight />}
		            </Button>
		          }
		          backButton={
		            <Button size="small" onClick={this.handlePrevious.bind(this)} disabled={this.state.currentlySelectedIndex === 0}>
		              {<KeyboardArrowLeft />}
		              Previous Quiz
		            </Button>
		          }
		        />

        		<SwipeableViews
		          axis={'x'}
		          index={this.state.currentlySelectedIndex}
		          onChangeIndex={this.handleStepChange.bind(this)}
		          enableMouseEvents
		        >
		        {this.state.quizzes.map(quiz => (
		        	<QuizEdit shouldHideTabbar={true} value={quiz} onChange={this.onChange.bind(this)} />
	            ))}
		        </SwipeableViews>

			</div>
			);
	}
}

export default HorizontalSlidePicker;