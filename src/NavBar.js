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
import SignOutButton from './SignOutPage';

import firebase from 'firebase/app';
import 'firebase/auth';

import {
    Link,
    withRouter,
} from 'react-router-dom';

const BG = "#74A4AC";


//hack because firebase sucks and cant provide display name right away
function username(name){
  if (name)
    return name;
  else
    return "My Profile";

}

function NavBar({authUser}, props) {
    return (<AppBar position="static">
            <section style={{backgroundColor: BG, display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                <Typography style={{flexGrow: 1, padding: "1em"}} variant="title" color="inherit">
                    Oasys Education
                </Typography>

                <Toolbar style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button href='/explore' color="inherit"> <IconExplore
                        style={{marginRight: '7px'}}/> Explore</Button>
                    <Button href='/create' color="inherit"> <IconCreate style={{marginRight: '7px'}}/> Create</Button>
                    <Button href='https://joinoasys.org' color="inherit">About</Button>
                    {authUser ? (
                            <div>
                                <Button href='/user' color="inherit">
                                    <IconAccountCircle style={{marginRight: '7px'}}/> {username(authUser.displayName)}
                                </Button>
                                <SignOutButton color="inherit"/>
                            </div>)
                        : <Button href="https://app.joinoasys.org/login" color="inherit">Sign In</Button>
                    }
                </Toolbar>
            </section>
        </AppBar>
    )
}

export default NavBar;
