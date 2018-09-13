import React, { Component } from 'react';

// import api from '../utils/api';
// import colors from '../utils/colors';
import VideoEditCropper from './VideoEditCropper';
import VideoPreview from './VideoPreview';

class Video extends Component {

    constructor(props) {
        super(props);
        this.onChangeUrl = this.onChangeUrl.bind(this);
        this.onChangeCrop = this.onChangeCrop.bind(this);
        this.props.handleStartLoading();
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
            const {cropStart, cropEnd} = this.props.data;
            const data  = {url, cropStart, cropEnd};
            this.props.handleAction({type: 'save', value: data});
        }
    }

    onChangeCrop(cropStart, cropEnd) {
        const {url} = this.props.data;
        const data  = {url, cropStart, cropEnd};
        this.props.handleAction({type: 'save', value: data});
    }

    renderVideo(){
        return (<div>
            {!this.props.isEditMode
                ? (<VideoPreview
                    data={this.props.data} 
                    elementId={this.props.id} 
                    isEditMode={this.props.isEditMode}
                    onLoad={this.props.handleReady}
                   />)
                : (<VideoEditCropper 
                    data={this.props.data} 
                    elementId={this.props.id} 
                    onChangeCrop={this.onChangeCrop}
                   />)
            }
        </div>)
    }

    render(){
        return (
            <div className='video-embed'>
                {this.props.data.url 
                ? this.renderVideo()
                :
                (
                    <div className='flex-center'>
                        <i className="fab fa-youtube fa-3x"></i>
                        <input
                          placeholder='Please enter a YouTube URL'
                          className='form-control url-input'
                          onChange={this.onChangeUrl}
                        />
                    </div>
                )
                }
            </div>
        )
    }
}

export default Video;