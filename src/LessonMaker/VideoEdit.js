import React, { Component } from 'react';

import api from '../api';
import colors from '../colors';
import VideoEditCropper from './VideoEditCropper';

class VideoEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: 'https://www.youtube.com/watch?v=gcS04BI2sbk&modestbranding=1&showinfo=0',
        }
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
            console.log(url)
            this.setState({url: url});
        }
    }

    render(){
        return (
            <div className='video-embed'>
                {this.state.url ? 
                    (
                    <VideoEditCropper url={this.state.url} elementId={this.props.id} />
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
