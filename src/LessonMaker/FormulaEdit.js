import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

import { BlockMath } from 'react-katex';

import PropTypes from 'prop-types';
// import api from '../utils/api'



//this is the new "Preview" Component
class FormulaEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	formula: null
        }

        this.onChangedSearchTerm = this.onChangedSearchTerm.bind(this);
    }

	onChangedSearchTerm(element) {
		this.setState({
            formula: element.target.value
        });
		this.props.onChange(element.target.value)
	}
	
    render() {

        const formula = this.state.formula? this.state.formula.split(" ").join(" \\space ") : null;

        return (
            <div>
                {this.props.isEditMode
                    ? (
                	<InputGroup>
    			        <InputGroupAddon addonType="prepend">🏎</InputGroupAddon>
    			        <Input placeholder="formula" onChange={this.onChangedSearchTerm}/>
    		        </InputGroup>
                    )
                    :
                    null
                }
            	<center>
            	{formula
                ? <div className='math-renderview'>
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

FormulaEdit.modules = {
    toolbar: null
}

FormulaEdit.propTypes = {
    isEditable: PropTypes.bool
}

export default FormulaEdit;
