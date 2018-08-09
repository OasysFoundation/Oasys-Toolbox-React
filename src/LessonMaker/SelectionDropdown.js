import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Button } from 'reactstrap';

import PropTypes from 'prop-types';

import colors from '../colors'


//this is the new "Preview" Component
class SelectionDropdown extends Component {
	constructor(props) {
        super(props);
        this.state = {
            default: props.default,
            options: props.options,
            onSelect: props.onSelect,
            isOpen: false
        }
    }

    toggleDropDown(element) {
    	this.setState({
    		isOpen: !this.state.isOpen
    	});
    }

    render() {
    	return (
	        <InputGroupButtonDropdown addonType="append" isOpen={this.state.isOpen} toggle={this.toggleDropDown.bind(this)}>
	            <DropdownToggle caret color="secondary">
	              {this.state.default}
	            </DropdownToggle>
	            <DropdownMenu>
		            {this.state.options.map(function(option) {
		            	return <DropdownItem>{option}</DropdownItem>
		            })}
	            </DropdownMenu>
	        </InputGroupButtonDropdown>
    		);
    }
}



export default SelectionDropdown;