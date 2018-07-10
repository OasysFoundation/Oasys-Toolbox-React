import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconExplore from '@material-ui/icons/Explore';
import IconCreate from '@material-ui/icons/Create';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import SignOutButton from './SignOutButton';

import firebase from 'firebase/app';
import 'firebase/auth';
import { auth } from './firebase';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Name from './Name'
import ButtonBase from '@material-ui/core/ButtonBase';


import {
    Link,
    withRouter,
} from 'react-router-dom';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const BG = "#74A4AC";
 

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {

    const loggedIn = this.props.authUser && this.props.authUser != "loggedOut";

    let accountMenuItems = (
        <Button href="/login" color="inherit">Sign In</Button>
      );
    
    if (loggedIn) {
      accountMenuItems = (
        <div style={{display: 'inline'}}>
        <Button href='/user' color="inherit">
            <IconAccountCircle style={{marginRight: '7px'}}/>
            {this.props.authUser.displayName}
        </Button>

        <SignOutButton color="inherit" handleClick={this.handleClick.bind(this)} />
        </div>
      )
    }

    let navBarElements = (
        <div>
        <Button href='/explore' color="inherit">
          <IconExplore style={{marginRight: '7px'}}/>
          Explore
        </Button>
                    
        <Button href='/create' color="inherit">
          <IconCreate style={{marginRight: '7px'}}/>
          Create
        </Button>

        {accountMenuItems}

        <Button href='https://joinoasys.org' color="inherit">About</Button>

        </div>
      );


    const { classes } = this.props;
    return (
      <AppBar position="static">
            <section style={{backgroundColor: BG, display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <ButtonBase
            onClick={function(event) {event.preventDefault(); window.location.href = '/explore/'}} style={{flexGrow: 1, padding: "1em", display: 'inline-block'}}>
                <Typography variant="title" color="inherit" href='/explore'>
                    Oasys Education
                </Typography>
            </ButtonBase>
            

                <Toolbar style={{display: "flex", justifyContent: "flex-end"}}>
                  <div>
                    {this.props.authUser
                      ? navBarElements
                      : null
                    }
                  </div>
                </Toolbar>
            </section>

            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.open}
              autoHideDuration={3000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Signed out successful</span>}
              action={[
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

        </AppBar>

    )
  }
}


NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);   

