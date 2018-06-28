import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import imgA from './play_images/Intervals800.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import logo from './logo.jpg'

const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`


class ContentSelection extends Component {
    constructor(props) {
        super();
        const loadContent = 'https://api.joinoasys.org/GetContentsPreview';
        const that = this;
        this.state = {
            content: []
        }

        fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            that.setState({content: myJson})
        });

    }
    render(){
        return (
            <div>
                <Paper style={{margin:'16px', padding:'16px'}}>
                    <center>
                    <h2> Welcome to Oasys! </h2>
                    <p style={{maxWidth:'450px'}}>
                    Start your educational journey here. Search for topics you're interested in or select one of the personally curated contents below.
                    </p>

                    <TextField
                      id="search"
                      label="Search…"
                      style={{width:'400px'}} 
                      type="text"
                      margin="normal"
                    />

                    </center>
                </Paper>
                <Flexer>
                    {this.state.content.length==0? (
                            <CircularProgress style={{ color: 'orange' }} thickness={7} />
                        ) : (
                            this.state.content.map((d, i) => <SimpleMediaCard key={i} contentData={d}/>)
                        )
                    }
                </Flexer>
            </div>
        )
    }
}

export default ContentSelection;