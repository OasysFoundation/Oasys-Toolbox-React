import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import imgA from './play_images/Intervals800.png';
import CircularProgress from '@material-ui/core/CircularProgress';

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