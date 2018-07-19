import React from 'react';
import TextField from '@material-ui/core/TextField'

import {CoolPinkButton, CoolBlueButton} from "../stylings";


const SystemSimEdit = function (props) {
    let {url} = props.value;
    console.log('SYSPROPS', props)

    let inputVal = "";
    const defaultURL = 'https://codap.concord.org/releases/latest/static/dg/en/cert/index.html#shared=45576'

    const inputting = function(ev){
        inputVal = ev.target.value;
    }


    const dimensions = {
        view: {
            width: window.innerWidth,
            height: window.innerHeight * 0.85
        },
        edit: {
            width: window.innerWidth * 2 / 3,
            height: window.innerHeight,
        }
    }

    let dim = dimensions.view;

    if (props.editing) {
        dim = dimensions.edit;
    }

    return (<div id="systemEditor">
        {url ? null :
            (<div id="systemEditor">
                <TextField
                    id="full-width"
                    label="Viewers can see and play with the state of your current system"
                    placeholder="Shareable Link from System"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    onChange={(ev) => inputting(ev)}
                />
                <CoolPinkButton style={{height: 1 + "rem"}} variant="flat" color="primary"
                                onClick={() => props.onChange({url: inputVal})}>Put System/Model from Link as Slide</CoolPinkButton>
                <figcaption style={{padding: 1 + "rem", color:'darkgrey'}}>{
                    `How to get a shareable Link:
                In the embedded window below, when your System is ready for your lesson:
                Go to the Menu on the top left (next to the title)
                and from there click on Share > Get Link to Shared View
                `}</figcaption>
                <CoolBlueButton onClick={() => window.open(defaultURL)}>
                    System Full Screen
                </CoolBlueButton>
            </div>)
        }

        <iframe title={Math.random().toString(36)}
                style={dim}
                allow="geolocation; microphone; camera;"
                src={url || defaultURL}>
        </iframe>
    </div>)
}


export default SystemSimEdit