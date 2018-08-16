import React, { Component } from 'react';


import { InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';


//this is the new "Preview" Component
class SelectionDropdown extends Component {
	constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
        this.toggleDropDown = this.toggleDropDown.bind(this);
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
	        <InputGroupButtonDropdown addonType="append" isOpen={this.state.isOpen} toggle={this.toggleDropDown}>
	            <DropdownToggle caret color="secondary">
	              {this.props.default}
	            </DropdownToggle>
	            <DropdownMenu>
		            {this.props.options.map(function(option, index) {
		            	return <DropdownItem onClick={function() { that.onSelectItem(index); }} key={"selection-dropdown-" + index} >{option}</DropdownItem>
		            })}
	            </DropdownMenu>
	        </InputGroupButtonDropdown>
		);
    }
}



export default SelectionDropdown;