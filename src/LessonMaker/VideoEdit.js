import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

import api from '../api'
import colors from '../colors'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

library.add(faMapMarker)

class VideoEdit extends Component {

    constructor(props) {
        super(props);
        this.min = 0;
        this.max = 1000;
        this.state = {
            start: 0,
            end: this.max,
        }
    }

    componentDidMount(){
        //rangesliderJs.create(document.querySelectorAll('input[type="range"]'));
    }

    onSlide(render, handle, value, un, percent){
        this.setState({
            start: value[0],
            end: value[1]
        })
        //console.log("SLIDE", render, handle, value, un, percent)
    }

    updateStart(e) {
        let val = parseFloat(e.target.value);
        console.log(val)
        if (val===undefined || isNaN(val)) { val = this.min; }

        this.setState({start: val});
        document.getElementById('slider'+this.props.id).noUiSlider.set([val, this.state.end]);
    }
    updateEnd(e) {
        let val = parseFloat(e.target.value);
        console.log(val)
        if (val===undefined || isNaN(val)) { val = this.max; }
        this.setState({end: val});
        document.getElementById('slider'+this.props.id).noUiSlider.set([this.state.start, val]);
    }

    render(){
        return (
            <div>
                {/*<FontAwesomeIcon icon="map-marker" />*/}
                {/*<input id="slider" type="range" min="0" max="5" value="1" step="1" />*/}
                <Nouislider
                    connect
                    start={[this.state.start, this.state.end]}
                    behaviour="tap"
                    id={"slider"+this.props.id}
                    range={{
                        min: [this.min],
                        // "10%": [500, 500],
                        // "50%": [4000, 1000],
                        max: [this.max]
                    }}
                    onSlide={this.onSlide.bind(this)}
                />
                <input onChange={this.updateStart.bind(this)} value={this.state.start} />
                <input onChange={this.updateEnd.bind(this)} value={this.state.end} />
            </div>
        )
    }
}

export default VideoEdit;
