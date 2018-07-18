import React from 'react';

const GameView = function(props){
        return (
            <iframe title={Math.random().toString(36)}
            		style={{width: window.innerWidth, height: window.innerHeight * 0.85}}
                    allow="geolocation; microphone; camera;"
                    src={props.url}>
            </iframe>
        )
};

export default GameView;
