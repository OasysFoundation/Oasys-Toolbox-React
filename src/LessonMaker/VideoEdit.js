import React, { Component } from 'react';

import api from '../api';
import colors from '../colors';
import VideoEditCropper from './VideoEditCropper';

class VideoEdit extends Component {

    constructor(props) {
        super(props);

    }

    isValidYouTubeUrl(url) {
        if (url !== undefined || url !== '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length === 11) {
                return true;
            } else {
                return false;
            }
        }
    }

    onChangeUrl(e) {
        const url = e.target.value;
        if (this.isValidYouTubeUrl(url)) {
            // TODO: report url change to Lessonmaker
            //this.props.url = url;
        }
    }

    onChangeCrop(startTime, endTime){
        // TODO: report startTime, endTime to Lessonmaker
        console.log(startTime);
        console.log(endTime);
    }

    render(){
        return (
            <div className='video-embed'>
                {this.props.data.url ? 
                    (
                    <VideoEditCropper 
                        url={this.props.data.url} 
                        elementId={this.props.id} 
                        onChangeCrop={this.onChangeCrop.bind(this)}
                    />
                    )
                    :
                    (
                    <div className='flex-center'>
                        <i class="fab fa-youtube fa-3x"></i>
                        <input
                          placeholder='Please enter a YouTube URL'
                          className='form-control url-input'
                          onChange={this.onChangeUrl.bind(this)}
                        />
                    </div>
                    )
                }
            </div>
        )
    }
}

export default VideoEdit;
