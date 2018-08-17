import React, {Component} from 'react';
import Iframe from 'react-iframe';
import Select from 'react-select';
import sha256 from 'js-sha256';

import interactives from '../assets/json/concord-interactives.json';

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
    left:'0', 
    top: '0'
}

function getConcordEmbeddables(){
    const CONCORD_URL = 'http://lab.concord.org/embeddable.html#';
    const concordIgnore = [
        'basic-examples', 
        'benchmarks', 
        'conversion-tests', 
        'conversion-tests/chemical-reactions',
        'building-models', 
        'student',
        'samples',
        'layout-tests',
        'student/stateofmatter',
        'student/motionandforce',
        'energy2d/examples',
        'iframe-model',
        'external-projects/ELeVATE',
        'external-projects/achieve',
        'external-projects/byu',
        'external-projects/geniverse',
        'external-projects/lawrence-hall',
        'external-projects/msu',
        'external-projects/sri',
        'external-projects/iframe',
        'external-projects/iframe-model',
        'interaction-tests',
        'itsi/energy-levels',
    ];
    let concordSims = interactives.interactives.filter(elem=> (
        elem.publicationStatus==='public' &&
        concordIgnore.indexOf(elem.groupKey)<0
    ));
    concordSims.map((elem,idx) => {
        elem.value = 'concord_' + sha256(elem.path);
        elem.label = elem.title + ': ' + elem.subtitle;
        elem.path = CONCORD_URL + elem.path;
        return null;
    });

    /*
    const concordGroups = [...new Set(concordSims.map(elem => elem.groupKey))];
    const concordGroupedSims = [];
    concordGroups.map(elem=>{
        concordGroupedSims.push({
            label: elem,
            options: concordSims.filter(sim=>sim.groupKey===elem)
        });
    });
    */
    return concordSims;
}


const concordSims = getConcordEmbeddables();


class EmbedEdit extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedOption) {
        this.props.onChange({
            id: selectedOption. value
        });
    }

    render() {
        const customSelectStyles = {
          control: styles => ({ ...styles, backgroundColor: 'white' }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = 'rgba(40,204,180, 0.5)';
            return {
              ...styles,
              backgroundColor: isSelected ? data.color : isFocused ? color : null,
              color: isSelected ? '#888' : data.color,
              cursor: 'pointer',
            };
          },
        };

        let candidates = concordSims.filter(e=>{
            return e.value==this.props.data.id;
        });
        let embedElem = candidates[0];
        return (
            <div className='embed-edit'>
                {this.props.isEditMode 
                ?   <div>
                        <Select
                            value={embedElem ? embedElem : null}
                            onChange={this.handleChange}
                            options={concordSims}
                            styles={customSelectStyles}
                          />
                          {embedElem
                           ? <p style={{margin: '10px 0px 15px 10px'}}>{embedElem.about.join(' ')}</p>
                           : null
                          }
                    </div>
                :   null
                }
                {embedElem
                ?  <div style={{position: 'relative', width: '100%', height: '0', paddingBottom: '75%'}}>
                    <Iframe 
                        url={embedElem.path}
                        width="100%"
                        height="100%"
                        id="myId"
                        className='iframe'
                        display="initial"
                        position="relative"
                        allowFullScreen
                        styles={customIframeStyles}
                    />
                   </div>
                : null
                }
            </div>
        )
    }
}


export default EmbedEdit;