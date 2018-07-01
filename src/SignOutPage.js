import React from 'react';
import { auth } from './firebase';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});



class SignOutPage extends React.Component {

  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
    auth.doSignOut();
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

   render() {
        const { classes } = this.props;

    return (
      <div>
  <Button
    type="button"
    color="inherit"
    onClick={this.handleClick}
  >Sign Out</Button>
  <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Signed Out</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
</div>

  )
}
}

SignOutPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignOutPage);   