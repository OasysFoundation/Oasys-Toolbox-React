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

      <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                    
      <Button style={{color:"white", flex: 1}}
        type="button"
        color="inherit"
        onClick={this.handleClick.bind(this)}
      >Sign Out</Button>

    </NavItem>

    )
  }
}

export default SignOutButton;   