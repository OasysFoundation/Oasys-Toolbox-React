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
            isOpen: false
        }
    }

    toggleDropDown(element) {
    	this.setState({
    		isOpen: !this.state.isOpen
    	});
    }

    onSelectItem(index) {
    	this.props.onSelect(this.props.identifier, index);
    }

    render() {
    	var that = this;
    	return (
	        <InputGroupButtonDropdown addonType="append" isOpen={this.state.isOpen} toggle={this.toggleDropDown.bind(this)}>
	            <DropdownToggle caret color="secondary">
	              {this.props.default}
	            </DropdownToggle>
	            <DropdownMenu>
		            {this.props.options.map(function(option, index) {
		            	return <DropdownItem onClick={function() { that.onSelectItem(index); }}>{option}</DropdownItem>
		            })}
	            </DropdownMenu>
	        </InputGroupButtonDropdown>
    		);
    }
}



export default SelectionDropdown;