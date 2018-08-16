import React, {Component} from 'react';
import Iframe from 'react-iframe';
import Select from 'react-select';

import Sha256 from '../utils/sha256';
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
        elem.value = Sha256.hash(concordSims[0].path);
        elem.label = elem.title + ': ' + elem.subtitle;
        elem.path = CONCORD_URL + elem.path;
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

class EmbedEdit extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();

        this.concordSims = getConcordEmbeddables();

        this.state = {
            selectedOption: this.concordSims[0],
        }
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
    }

    render() {
        const customSelectStyles = {
          control: styles => ({ ...styles, backgroundColor: 'white' }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = 'rgba(40,204,180, 0.5)';
            return {
              ...styles,
              backgroundColor: isDisabled
                ? null
                : isSelected ? data.color : isFocused ? color : null,
              color: isDisabled
                ? '#ccc'
                : isSelected
                  ? '#888'
                  : data.color,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            };
          },
        };

        return (
            <div className='embed-edit'>
                {this.props.isEditMode 
                ?   <div>
                        <Select
                            defaultValue={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.concordSims}
                            styles={customSelectStyles}
                          />
                        <p style={{margin: '10px 0px 15px 10px'}}>{this.state.selectedOption.about}</p>
                    </div>
                :   null
                }
                <div style={{position: 'relative', width: '100%', height: '0', paddingBottom: '75%'}}>
                    <Iframe 
                        url={this.state.selectedOption.path}
                        width="100%"
                        id="myId"
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowFullScreen
                        styles={customIframeStyles}
                    />
                </div>
            </div>
        )
    }
}


export default EmbedEdit;