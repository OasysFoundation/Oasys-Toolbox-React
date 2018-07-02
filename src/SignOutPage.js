import React from 'react';
import { auth } from './firebase';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';


class SignOutPage extends React.Component {



   render() {
    return (
      <Button
        type="button"
        color="inherit"
        onClick={auth.doSignOut}
      >Sign Out</Button>
    )
  }
}

export default SignOutPage;   