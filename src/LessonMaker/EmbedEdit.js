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
        elem.value = 'concord_' + idx.toString();
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

class EmbedEdit extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();

        this.concordSims = getConcordEmbeddables();

        let selectedOption = null;
        if (this.props.data.id !== '' && this.props.data.id.substring(0,7) ===  'concord') {
            const candidates = this.concordSims.filter(e=>{
                return e.value==this.props.data.id;
            });

            if (candidates.length===0) {
                throw new Error('Could not find concord embeddable with id: ' + this.props.data.id);
            } else {
                selectedOption = candidates[0];
            }
        }

        this.state = {
            selectedOption: selectedOption,
        }

        this.handleChange = this.handleChange.bind(this);

        console.log(this.concordSims);
    }

    handleChange(selectedOption) {
        this.setState({ selectedOption });
        this.props.onChange({
            id: selectedOption.value,
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

        return (
            <div className='embed-edit'>
                {this.props.isEditMode 
                ?   <div>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.concordSims}
                            styles={customSelectStyles}
                          />
                          {this.state.selectedOption 
                           ? <p style={{margin: '10px 0px 15px 10px'}}>{this.state.selectedOption.about.join(' ')}</p>
                           : null
                          }
                    </div>
                :   null
                }

                {this.state.selectedOption 
                 ? <div style={{position: 'relative', width: '100%', height: '0', paddingBottom: '75%'}}>
                  {/*
                     <iframe title={Math.random().toString(36)}
                            style={{width: '100%', height: '100%'}}
                            allow="geolocation; microphone; camera;"
                            src={this.state.selectedOption.path}
                      />
                  */}
                    <Iframe 
                        url={this.state.selectedOption.path}
                        width="100%"
                        height="100%"
                        id="myId"
                        className={this.props.isEditMode ? "iframe_edit" : "iframe_preview" } 
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