import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import imgA from './play_images/Intervals800.png';

const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

const mockDataContentList =
    [
        {
            "title": "YOLO",
            "tags": ["physics", "math"],
            "description": "John Hapiderp is exploring the rainforest, when suddenly he stumbles upon an ancient temple",
            "thumbnail": "",
            "location": "/contents/markus/deerhunter"
        },

        {
            "title": "Brunz Feather",
            "tags": ["chemistry"],
            "description": "Thiel ferdinand is a rogue tomato trapped inside a hyperbarric chamber",
            "thumbnail": "", "location": ""
        }

    ];

class ContentSelection extends Component {
    constructor(props) {
        super();
        const loadContent = 'http://174.138.2.82/GetAllContent';
        const that = this;
        this.state = {
            content: mockDataContentList
        }

        fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            console.log(response);
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
                    {this.state.content.map((d, i) => <SimpleMediaCard key={i} imgURL={d.thumbnail} contentData={d}/>)}
                </Flexer>
            </div>
        )
    }
}

export default ContentSelection;