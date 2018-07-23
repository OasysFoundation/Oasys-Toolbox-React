import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
//import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import DialogActions from '@material-ui/core/DialogActions';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import glb from "../globals";

import Typography from '@material-ui/core/Typography';


import TextIcon from '../icons/Text.png'
import QuizIcon from '../icons/Quiz.png'
import GameIcon from '../icons/Game.png'
import HypervideoIcon from '../icons/Hypervideo.png'
import SystemSimulationIcon from '../icons/SystemSimulation.png'




const slideTypes = [glb.EDIT_QUILL, glb.EDIT_QUIZ, glb.EDIT_GAME, glb.EDIT_HYPERVIDEO, glb.EDIT_SYSTEM];

class SlideTypeSelection extends Component {

	handleClose() {
		this.props.onClose();
	}

	didSelectSlideType(slideType) {
		this.props.onSelect(slideType);
	}


	iconForSlideType(slideType) {
		switch(slideType) {
			case glb.EDIT_QUILL: return TextIcon;
			case glb.EDIT_QUIZ: return QuizIcon;
			case glb.EDIT_GAME: return GameIcon;
			case glb.EDIT_HYPERVIDEO: return HypervideoIcon;
			case glb.EDIT_SYSTEM: return SystemSimulationIcon;
			default: return;
		}
	}

	titleForSlideType(slideType) {
		switch(slideType) {
			case glb.EDIT_QUILL: return "Text";
			case glb.EDIT_QUIZ: return "Quiz";
			case glb.EDIT_GAME: return "Game";
			case glb.EDIT_HYPERVIDEO: return "Hypervideo";
			case glb.EDIT_SYSTEM: return "System Simulation";
			default: return "";
		}
	}

	render() {
		var that = this;
		return(
			<div>
				<Dialog open={this.props.open} onClose={this.handleClose.bind(this)} aria-labelledby="simple-dialog-title">
        		<DialogTitle id="simple-dialog-title">Add new Slide</DialogTitle>
        		<div>
        			<Grid container spacing={16} style={{flexGrow: 1, margin:'16px'}}>
        			{slideTypes.map(function(slideType) {
        				return (
        					<Grid item>
        					<Card style={{width:'120px', height:'120px', textAlignment:'center'}}>
        					<ButtonBase
			                      onClick={function() {that.didSelectSlideType(slideType)}}
			                      style={{width:'120px', height:'120px', display: 'block'}}
			                  >
        					<CardMedia
					          image={that.iconForSlideType(slideType)}
					          title={that.titleForSlideType(slideType)}
					          style={{paddingTop: '56.25%'}}
					        />
		                <CardContent>
		                <center>
				          <Typography component="p">
				            {that.titleForSlideType(slideType)}
				          </Typography>
			            </center>
			          	</CardContent>
			          	</ButtonBase>
        					</Card>
        					</Grid>
        					);
        			})}
        			</Grid>
        		</div>
        		<DialogActions>
		          <Button onClick={this.handleClose.bind(this)}>
		            Cancel
		          </Button>
		        </DialogActions>
        		</Dialog>
			</div>
			);
	}
}

export default SlideTypeSelection;