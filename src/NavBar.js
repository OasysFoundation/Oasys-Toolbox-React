import React from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconExplore from '@material-ui/icons/Explore';
import IconCreate from '@material-ui/icons/Create';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const BG = "#74A4AC";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


function NavBar(props) {
  const { classes } = props;
    return (
        <AppBar position="static">
        <Toolbar style={{backgroundColor: BG}}>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Oasys Education
          </Typography>
            <Button href='/explore' color="inherit"> <IconExplore style={{margin:'7px'}}/> Explore</Button>
            <Button href='/create' color="inherit"> <IconCreate style={{margin:'7px'}}/> Create</Button>
            <Button href='/user' color="inherit"> <IconAccountCircle style={{margin:'7px'}}/> My Account</Button>
            <Button href='https://joinoasys.org' color="inherit">About</Button>
        </Toolbar>
      </AppBar>
    )
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);