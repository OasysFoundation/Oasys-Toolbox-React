import React from 'react';
import gameMetaData from "./gameMetaData"


//Had to make this one just for the routing and GameView separetely....
//location is otherwise thought of as Props....because first argument...

const GameEmbedder = function ({location}) {
    if (!location) {
        location = window.location.href;
    }
    const folders = location.pathname.split('/').filter(e => e.length > 0).slice(-2);
    const gameName = folders[1];
    let url;
    try {
        url =gameMetaData.filter(d => (d.name === gameName))[0].url;
    }
    catch(error) {
        alert("This Game is not yet added to the DataBase")
    }
    return (
        <iframe title={Math.random().toString(36)}
                style={{width: window.innerWidth, height: window.innerHeight * 0.85}}
                allow="geolocation; microphone; camera;"
                src={url}>
        </iframe>
    )
};

export default GameEmbedder;
