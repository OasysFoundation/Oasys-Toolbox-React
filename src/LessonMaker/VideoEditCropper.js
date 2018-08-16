import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ReactDOM from 'react-dom';

import Nouislider from "nouislider-react";
import ReactPlayer from 'react-player'

import 'nouislider/distribute/nouislider.css';

const playerWidth = '640px';
const playerHeight = '360px';

class VideoEditCropper extends Component {

    onSlide(render, handle, value, un, percent){
        this.onChangeCrop(value[0], value[1]);
    }

    formatTime(time) {
    	// outputs time in the same format that youtube uses 
    	let timeStr = '';
    	if (time / 3600 >= 1.0) {
    		timeStr += Math.floor(time / 3600).toString() + ':';
    		time -= Math.floor(time / 3600) * 3600;
    	}
		timeStr += Math.floor(time / 60).toString().padStart(2,'0') + ':';
		time -= Math.floor(time / 60) * 60;
		timeStr += Math.floor(time).toString().padStart(2,'0');
		return timeStr;
    }

    onSetStart(){
    	let time = this.refs.video.getCurrentTime();
        if (time===undefined || time===null || time>this.props.data.cropEnd) { time = this.props.data.cropEnd; }
        document.getElementById('video-slider'+this.props.elementId).noUiSlider.set([time, this.props.data.cropEnd]);
    	this.refs.inputStart.value = this.formatTime(time);
    	this.props.onChangeCrop(time, this.props.data.cropEnd);
    }

    onSetEnd(){
    	let time = this.refs.video.getCurrentTime();
        if (time===undefined || time===null || time<this.props.data.cropStart) { time = this.props.data.cropStart; }
        document.getElementById('video-slider'+this.props.elementId).noUiSlider.set([this.props.data.cropStart, time]);
    	this.refs.inputEnd.value = this.formatTime(time);
    	this.props.onChangeCrop(this.props.data.cropStart, time);
    }

    // this is not being used when input fields are disabled (default)
    updateStart(e) {
        let time = parseFloat(e.target.value);
        if (time===undefined || isNaN(time)) { time = this.min; }
        if (time>this.props.data.cropEnd) { time = this.props.data.cropEnd; }
        this.props.onChangeCrop(time, this.props.data.cropEnd);
        this.refs.video.seekTo(time);
        this.refs.video.getInternalPlayer().pauseVideo();
        document.getElementById('video-slider'+this.props.elementId).noUiSlider.set([time, this.props.data.cropEnd]);
    }

    updateEnd(e) {
        let time = parseFloat(e.target.value);
        if (time===undefined || isNaN(time)) { time = this.max; }
        if (time<this.cropStart) { time = this.cropStart; }
        this.props.onChangeCrop(this.props.data.cropStart, time);
        this.refs.video.seekTo(time);
        this.refs.video.getInternalPlayer().pauseVideo();
        document.getElementById('video-slider'+this.props.elementId).noUiSlider.set([this.props.data.cropStart, time]);
    }

    onChangeCrop(cropStart, cropEnd){
        this.props.onChangeCrop(cropStart, cropEnd);
    }

    onPlayerReady() {
    	let max = this.refs.video.getDuration();
        if (this.props.data.cropEnd===0.0) {
            this.onChangeCrop(0.0, max);
        }
    	ReactDOM.render(
    		<Nouislider
                connect
                disabled={true}
                start={[this.props.data.cropStart, this.props.data.cropEnd]}
                behaviour="tap"
                id={"video-slider"+this.props.elementId}
                range={{
                    min: 0,
                    max: max
                }}
                onSlide={this.onSlide.bind(this)}
            />
    	, this.refs.sliderWrapper);

        document.getElementById('video-slider'+this.props.elementId).noUiSlider.set([this.props.data.cropStart, this.props.data.cropEnd]);
    }

	render(){
		// &modestbranding=1&showinfo=0
		let youtubeConfig = {
      		playerVars: { 
      			showinfo: 1,
      			modestbranding: 1,
      			controls: 1,
      			loop: 0,
      			rel: 0,
      			enablejsapi: 1,
      			//start: 10,
      			//end: 20,
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
	                  onReady={this.onPlayerReady.bind(this)}
	                  width={playerWidth}
	                  height={playerHeight}
	                />
                </div>
                <center>
                	<p className='help-text'> If you only want to show part of the video, you can seek to the start/end of the part
                		that you want to show and then click on the 'set to current time' buttons below.</p>
                	<div ref='sliderWrapper' className='slider-wrapper' style={{width: playerWidth}} />
                </center>
                <center>
	                <div className='video-controls' style={{width: playerWidth}}>
	                    <input 
	                    	readonly='readonly'
	                        onInput={this.updateStart.bind(this)} 
	                        className='form-control'
	                        placeholder='0'
	                        ref='inputStart'
                            defaultValue={this.formatTime(this.props.data.cropStart)}
	                    />
	                    <Button className='bgprimary' style={{marginRight: 'auto'}} onClick={this.onSetStart.bind(this)}>
	                    	<i class="fas fa-arrow-left" style={{marginRight: '5px'}}></i> 
	                    	set to current time
	                    </Button>

	                    <Button className='bgprimary' color="#28CCB4" onClick={this.onSetEnd.bind(this)}>
	                    	set to current time
	                    	<i class="fas fa-arrow-right" style={{marginLeft: '5px'}}></i> 
	                    </Button>
	                    <input 
	                    	readonly='readonly'
	                        onInput={this.updateEnd.bind(this)} 
	                        className='form-control'
	                        placeholder='0'
	                        ref='inputEnd'
                            defaultValue={this.formatTime(this.props.data.cropEnd)}
	                    />
	                </div>
                </center>
            </div>
		)
	}
}

export default VideoEditCropper;












					