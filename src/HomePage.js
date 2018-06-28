import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import imgA from './play_images/Intervals800.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import logo from './logo.jpg';
import ContentSelection from './ContentSelection';
import LoginPage from './LoginPage';

class HomePage extends Component {
    constructor(props) {
        super();

    }

    render(){
      return(
        <div>
          { this.props.authUser
              ? <ContentSelection/>
              : <LoginPage/>
          }
        </div>
        )
    }
}

export default HomePage;