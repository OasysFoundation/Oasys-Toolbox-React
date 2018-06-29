import React, {Component} from 'react';


const styling = {
    width: 50 + "vw",
    height: 50 + "vh"
}

const IFrameEmbed = (props) => (
    <iframe style={styling} sandbox="allow-same-origin allow-scripts allow-modals" allow="microphone" allow="camera"
            seamless src={ "https://dacapo.io/web-piano/"} frameBorder="0" allowFullScreen>
    </iframe>
)

export default IFrameEmbed;
