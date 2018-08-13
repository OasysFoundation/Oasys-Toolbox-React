import React, { Component } from 'react';

// import api from '../api';
// import colors from '../colors';
import VideoEditCropper from './VideoEditCropper';

class VideoEdit extends Component {

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
            let data = this.props.data;
            data.url = url;
            this.props.onChange(data);
        }
    }

    onChangeCrop(cropStart, cropEnd) {
        let data = this.props.data;
        data.cropStart = cropStart;
        data.cropEnd = cropEnd;
        this.props.onChange(data);
    }

    render(){
        return (
            <div className='video-embed'>
                {this.props.data.url ? 
                    (
                    <VideoEditCropper 
                        data={this.props.data} 
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
