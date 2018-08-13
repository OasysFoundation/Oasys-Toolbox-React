import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

import { BlockMath } from 'react-katex';

import PropTypes from 'prop-types';
// import api from '../api'



//this is the new "Preview" Component
class FormulaEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	formula: null
        }
    }

	onChangedSearchTerm(element) {
		this.setState({
            formula: element.target.value
        });
	}
	
    render() {
        return (
            <div>
            	<InputGroup>
			        <InputGroupAddon addonType="prepend">🏎</InputGroupAddon>
			        <Input placeholder="formula" onChange={this.onChangedSearchTerm.bind(this)}/>
		        </InputGroup>
            	<center>
            	{this.state.formula
                ? <div className='math-renderview'>
                    <BlockMath 
                        math={this.state.formula}
                        renderError={(error) => {
                          return <b>Fail: {error.name}</b>
                        }}
                    />
                  </div> 
                : <div className='math-preview'>
                    Formula preview <br/>
                    <small>
                        (You can type any <a href='https://en.wikibooks.org/wiki/LaTeX/Mathematics' target='_blank' rel="noopener noreferrer">latex math expression</a> here)
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
