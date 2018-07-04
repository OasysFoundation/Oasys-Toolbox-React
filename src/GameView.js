import React, {Component} from 'react';
import gameMetaData from "./gameMetaData"

const GameView = function(props){
        return (
            <iframe style={{width: window.innerWidth, height: window.innerHeight * 0.85}}
                    allow="geolocation; microphone; camera;"
                    src={props.url}>
            </iframe>
        )
};

export default GameView;
