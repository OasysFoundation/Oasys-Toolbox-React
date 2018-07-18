import React from 'react';
import { auth } from './firebase';
import Button from '@material-ui/core/Button';

class SignOutButton extends React.Component {


  handleClick() {
    auth.doSignOut();
    this.props.handleClick();
  }

   render() {
    return (
      <Button
        type="button"
        color="inherit"
        onClick={this.handleClick.bind(this)}
      >Sign Out</Button>
    )
  }
}

export default SignOutButton;   