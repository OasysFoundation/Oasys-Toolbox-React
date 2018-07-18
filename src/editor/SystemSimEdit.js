import React from 'react';

import {CoolPinkButton} from "../stylings";


const SystemSimEdit = function (props) {
    // console.log("System props", props)
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

    return (<div>
        {url ? null :
            (<div>
                <input onChange={(ev) => inputting(ev)} label="...add System Sim"/>
                <CoolPinkButton style={{height: 1 + "rem"}} variant="flat" color="primary"
                                onClick={() => props.onChange({url: inputVal})}>Submit</CoolPinkButton>
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