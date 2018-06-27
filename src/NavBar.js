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
import SignOutButton from './SignOutPage';

import {
  Link,
  withRouter,
} from 'react-router-dom';

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


// function NavBar(props) {
//   const { classes } = props;
//     return (
//         <AppBar position="static">
//         <Toolbar style={{backgroundColor: BG}}>
//           <Typography variant="title" color="inherit" className={classes.flex}>
//             Oasys Education
//           </Typography>
//             <Button href='/explore' color="inherit"> <IconExplore style={{marginRight:'7px'}}/> Explore</Button>
//             <Button href='/create' color="inherit"> <IconCreate style={{marginRight:'7px'}}/> Create</Button>
//             <Button href='/user' color="inherit"> <IconAccountCircle style={{marginRight:'7px'}}/> My Account</Button>
//             <Button href='https://joinoasys.org' color="inherit">About</Button>
//             <SignOutButton color="inherit"/>


//         </Toolbar>
//       </AppBar>
//     )
// }

function NavBar (props, { authUser }) {
  return(
    <div>
      { authUser
          ? <NavigationAuth classes={props}/>
          : <NavigationNonAuth classes={props}/>
      }
    </div>
    )
}


NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


const NavigationAuth = (props) =>
 <AppBar position="static">
        <Toolbar style={{backgroundColor: BG}}>
          <Typography variant="title" color="inherit" className={props.classes.flex}>
            Oasys Education
          </Typography>
            <Button href='/explore' color="inherit"> <IconExplore style={{marginRight:'7px'}}/> Explore</Button>
            <Button href='/create' color="inherit"> <IconCreate style={{marginRight:'7px'}}/> Create</Button>
            <Button href='/user' color="inherit"> <IconAccountCircle style={{marginRight:'7px'}}/> My Account</Button>
            <Button href='https://joinoasys.org' color="inherit">About</Button>
            <SignOutButton color="inherit"/>


        </Toolbar>
      </AppBar>

const NavigationNonAuth = (props) =>
 <AppBar position="static">
        <Toolbar style={{backgroundColor: BG}}>
          <Typography variant="title" color="inherit" className={props.classes.flex}>
            Oasys Education
          </Typography>
            <Button href='/explore' color="inherit"> <IconExplore style={{marginRight:'7px'}}/> Explore</Button>
            <Button href='/create' color="inherit"> <IconCreate style={{marginRight:'7px'}}/> Create</Button>
            <Button href='https://joinoasys.org' color="inherit">About</Button>
            <Button href="https://app.joinoasys.org/login" color="inherit">Sign In</Button>



        </Toolbar>
      </AppBar>

export default withStyles(styles)(NavBar);
