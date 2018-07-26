import React from 'react';
import { auth } from './firebase';
import Button from '@material-ui/core/Button';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class SignOutButton extends React.Component {


  handleClick() {
    auth.doSignOut();
    this.props.handleClick();
  }

   render() {
    return (

      <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                    
      <NavLink onClick={this.handleClick.bind(this)} className={"text-white"}>Sign Out</NavLink>

     

    </NavItem>

    )
  }
}

export default SignOutButton;   