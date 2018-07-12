import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import HyperVideoEditor from './HyperVideoEditor'

class HyperVideoSetup extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	videoURL: this.props.value.videoURL,
	    	quizzes: this.props.value.quizzes
	    }
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
	    	videoURL: nextProps.value.videoURL,
	    	quizzes: nextProps.value.quizzes
	    });
	}

	notifyDelegate() {
		this.props.onChange({
			"quizzes": this.state.quizzes,
			"videoURL": this.state.videoURL
		});
	}

	didChangeVideoURL(textfield) {
		const url = textfield.target.value;
		console.log("didChangeVideoURL: "+url);
		if (this.isValidYouTubeUrl(url)) {
			this.setState({
				videoURL: url
			}, function() {
				this.notifyDelegate();
			});
		}
	}

	isValidYouTubeUrl(url) {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            } else {
                return false;
            }
        }
	}

	render() {
		return(
			<div style={{maxWidth:'640px'}} id='hyperVideoEditor'>
			{this.state.videoURL ? 
				(
					<HyperVideoEditor onChange={this.props.onChange} value={{quizzes: this.state.quizzes, videoURL: this.state.videoURL}} preview={false}/>
				)
				:
				(
					<div>
					<center style={{marginBottom:'40px'}}>
	                <VideoLibraryIcon color="secondary" style={{ fontSize: '100px' }}/>
	                <h1>Hyper Video Editor</h1> 
	                </center>
	                <div><p>The Hyper Video Editor allows you to embed quizzes into YouTube videos.<br/>Please insert the URL to the YouTube video below to get started:</p></div>
		 	   		<TextField
		              id="name"
		              placeholder="YouTube URL"
		              margin="normal"
		              style={{width:'100%', 'margin-bottom': '20px'}}
		              onChange={this.didChangeVideoURL.bind(this)}
		            />
		            </div>
				)
			}
			</div>
			)
	}
}


export default HyperVideoSetup;