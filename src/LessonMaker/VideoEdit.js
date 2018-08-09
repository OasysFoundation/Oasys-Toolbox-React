import React, { Component } from 'react';
//import rangesliderJs from 'rangeslider-js'

import api from '../api'

import colors from '../colors'

class VideoEdit extends Component {

    componentDidMount(){
        //rangesliderJs.create(document.querySelectorAll('input[type="range"]'));
    }

    render(){
        return (
            <div>
                <input id="slider" type="range" min="0" max="5" value="1" step="1" />
            </div>
        )
    }
}

export default VideoEdit;
