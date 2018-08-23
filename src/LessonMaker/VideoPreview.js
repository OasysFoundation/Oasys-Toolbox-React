import React, { Component } from 'react';

import ReactPlayer from 'react-player'

import 'nouislider/distribute/nouislider.css';

const playerWidth = '640px';
const playerHeight = '360px';

class VideoPreview extends Component {

	constructor(props) {
		super(props);
		this.onPlay = this.onPlay.bind(this);
		this.onPause = this.onPause.bind(this);
		this.onEnded = this.onEnded.bind(this);
	}

	onPlay(){
		if (!this.props.isEditMode) {
			console.log('video ' + this.props.elementId + ' starts playing. Analytics to be implemented');
		}
	}

	onPause(){
		if (!this.props.isEditMode) {
			console.log('video ' + this.props.elementId + ' pauses. Analytics to be implemented');
		}
	}

	onEnded(){
		if (!this.props.isEditMode) {
			console.log('video ' + this.props.elementId + ' ends. Analytics to be implemented');
		}
		this.props.onFinishedVideo();
	}

	render(){
		let youtubeConfig = {
      		playerVars: { 
      			showinfo: 1,
      			modestbranding: 1,
      			controls: 0,
      			loop: 0,
      			rel: 0,
      			enablejsapi: 1,
      			start: parseInt(this.props.data.cropStart,10),
      			end: parseInt(this.props.data.cropEnd,10),
      		}
		}
		return(
			<div>
				<div className='videoEditWrapper'>
	                <ReactPlayer
                      url={this.props.data.url}
	                  config={{youtube: youtubeConfig}}
	                  ref='video'
	                  playing={false}
	                  width={playerWidth}
	                  height={playerHeight}
	                  onPlay={this.onPlay}
	                  onPause={this.onPause}
	                  onEnded={this.onEnded}
	                />
                </div>
            </div>
		)
	}
}

export default VideoPreview;












					