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
import SignOutButton from './SignOutPage';


const BG = "#74A4AC";


class NavigationAuth extends React.Component {
    constructor(props) {
        super();
    }

    render(){
      console.log(this.props.authUser)
      return(
        <AppBar position="static">
        <Toolbar style={{backgroundColor: BG}}>
          <Typography variant="title" color="inherit" className={this.props.classes.flex}>
            Oasys Education
          </Typography>
            <Button href='/explore' color="inherit"> <IconExplore style={{marginRight:'7px'}}/> Explore</Button>
            <Button href='/create' color="inherit"> <IconCreate style={{marginRight:'7px'}}/> Create</Button>
            <Button href='/user' color="inherit"> <IconAccountCircle style={{marginRight:'7px'}}/> {this.props.authUser.displayName}</Button>
            <Button href='https://joinoasys.org' color="inherit">About</Button>
            <SignOutButton color="inherit"/>


        </Toolbar>
      </AppBar>
        )
    }
}

export default NavigationAuth;