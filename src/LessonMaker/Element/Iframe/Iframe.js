import React, {Component} from 'react';
import {Iframe as IframeReact} from 'react-iframe';
//import Select from 'react-select';
//import sha256 from 'js-sha256';
import {Input} from 'reactstrap';
import isUrl from 'is-url';


//import interactives from '../assets/json/concord-interactives.json';

/*

We embed interactives from the following sources here:
- The Concord Consortium Lab project (http://lab.concord.org) is Copyright 2012 (c) by the Concord Consortium and is distributed under the MIT license.

NOTE: We have cloned their https://lab.concord.org/interactives.json as concord-interactives.json.
This should be updated once in a while!

*/

const customIframeStyles = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0'
}

class Iframe extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.props.handleStartLoading();

        this.state = {
            iframeURL: props.data.id || null
        };
    }

    handleChange(selectedOption, isExternal = false) {

        isExternal && isUrl(selectedOption.value)
            ? this.setState({iframeURL: selectedOption.value})
            : this.setState({iframeURL: null})

        this.props.handleChange({
            id: selectedOption.value,
        }, false, true);
    }

    render() {
        return (
            <div className='embed-edit'>
                {this.props.isEditMode && <div>
                    <Input
                        defaultValue={this.props.data.id || 'Embed something from a URL'}
                        onChange={e => this.handleChange(e.target, true)}
                    />
                </div>
                }
                {this.state.iframeURL &&
                <div style={{position: 'relative', width: '100%', height: '0', paddingBottom: '75%'}}>
                    <IframeReact
                        url={this.props.data.id || this.state.iframeURL}
                        width="100%"
                        height="100%"
                        id="myId"
                        className='iframe'
                        display="initial"
                        position="relative"
                        allowFullScreen
                        styles={customIframeStyles}
                        onLoad={this.props.handleCompletedLoading}
                    />
                </div>
                }
            </div>
        )
    }
}


export default Iframe;