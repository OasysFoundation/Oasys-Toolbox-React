import React, { Component } from 'react';

import ReactPlayer from 'react-player'

import 'nouislider/distribute/nouislider.css';

const playerWidth = '640px';
const playerHeight = '360px';

class VideoPreview extends Component {

	render(){
		// &modestbranding=1&showinfo=0
		let youtubeConfig = {
      		playerVars: { 
      			showinfo: 1,
      			modestbranding: 1,
      			controls: 0,
      			loop: 0,
      			rel: 0,
      			enablejsapi: 1,
      			start: this.props.data.cropStart,
      			end: this.props.data.cropEnd,
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
	                />
                </div>
            </div>
		)
	}
}

export default VideoPreview;












					