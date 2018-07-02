import React, { Component } from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Quiz from './Quiz'


const defaultQuiz = {
	"question": "",
	"answers": [{"option": "", "correct": true}],
};

class HorizontalSlidePicker extends Component {
	constructor(props) {
	    super(props);
		this.state = {
			currentlySelectedIndex: 0
		}
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

	handleStepChange() {

	}

	onChange(content) {
		this.props.quizzes[this.state.currentlySelectedIndex] = content;
		this.props.onChange(this.props.quizzes);
	}


	render() {
		return (
			<div>
				<Paper square elevation={0}>
          			<Typography>QUIZZES</Typography>
        		</Paper>

        		<SwipeableViews
		          axis={'x'}
		          index={this.state.currentlySelectedIndex}
		          onChangeIndex={this.handleStepChange.bind(this)}
		          enableMouseEvents
		        >
		        {this.props.quizzes.map(quiz => (
		        	<Quiz shouldHideTabbar={true} value={quiz} onChange={this.onChange.bind(this)} />
	            ))}
		        </SwipeableViews>
		        <MobileStepper
		          steps={this.props.quizzes.length}
		          position="static"
		          activeStep={this.state.currentlySelectedIndex}
		          nextButton={
		            <Button size="small" onClick={this.handleNext.bind(this)} disabled={this.state.currentlySelectedIndex === this.props.quizzes.length - 1}>
		              Next
		              {<KeyboardArrowRight />}
		            </Button>
		          }
		          backButton={
		            <Button size="small" onClick={this.handlePrevious.bind(this)} disabled={this.state.currentlySelectedIndex === 0}>
		              {<KeyboardArrowLeft />}
		              Back
		            </Button>
		          }
		        />

			</div>
			);
	}
}

export default HorizontalSlidePicker;