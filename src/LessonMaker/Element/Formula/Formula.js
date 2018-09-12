import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

import { BlockMath } from 'react-katex';

import PropTypes from 'prop-types';
// import api from '../utils/api'



//this is the new "Preview" Component
class Formula extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
        	formula: this.props.data? this.props.data.formula : null
        };

        this.onChangedFormula = this.onChangedFormula.bind(this);
    }

	onChangedFormula(element) {
		this.setState({
            formula: element.target.value
        });
        const data = {formula: element.target.value};
        this.props.handleChange(data, false, true);
	}
	
    render() {

        const formula = this.state.formula? this.state.formula.split(" ").join(" \\space ") : null;

        return (
            <div>
                {this.props.isEditMode
                    ? (
                	<InputGroup>
    			        <InputGroupAddon addonType="prepend">🏎</InputGroupAddon>
    			        <Input value={this.state.formula} placeholder="formula" onChange={this.onChangedFormula}/>
    		        </InputGroup>
                    )
                    :
                    null
                }
            	<center>
            	{formula
                ? <div className={this.props.isEditMode ? 'math-renderview' : ''}>
                    <BlockMath 
                        math={formula}
                        renderError={(error) => {
                          return <b>Incorrect Input: {error.name}</b>
                        }}
                    />
                  </div> 
                : <div className='math-preview help-text'>
                    Formula Preview <br/>
                    <small>
                        You can type any <a target="_blank" rel="noopener noreferrer" href='https://en.wikibooks.org/wiki/LaTeX/Mathematics'>latex math expression</a> above.
                    </small>
                  </div>
                }
            	
            	</center>
            </div>
        )
    }
}

Formula.modules = {
    toolbar: null
}

Formula.propTypes = {
    isEditable: PropTypes.bool
}

export default Formula;
