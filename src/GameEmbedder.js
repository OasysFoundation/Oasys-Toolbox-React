import React, {Component} from 'react';
import gameMetaData from "./gameMetaData"

const GameEmbedder = function({location}, props){
    try {
        const folders = location.pathname.split('/').filter(e => e.length > 0).slice(-2);
        const gameName = folders[1];
        const url = gameMetaData.filter(d => (d.name === gameName))[0].url;

        return (
            <iframe style={{width: window.innerWidth, height: window.innerHeight * 0.85}}
                    allow="geolocation; microphone; camera;"
                    src={url}>
            </iframe>
        )
    }
    catch (error) {
        console.alert("Hey, this is the Error from GameEmbedder: ",  error)
    }

}



export default GameEmbedder;
