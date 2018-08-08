import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

import { InlineMath, BlockMath } from 'react-katex';

import PropTypes from 'prop-types';
import api from '../api'



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
			        <InputGroupAddon addonType="prepend">@</InputGroupAddon>
			        <Input placeholder="formula" onChange={this.onChangedSearchTerm.bind(this)}/>
		        </InputGroup>
            	<center>
            	{this.state.formula? <InlineMath math={this.state.formula}/> : <img src="https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" />}
            	
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
