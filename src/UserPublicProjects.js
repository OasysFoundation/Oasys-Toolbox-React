import React from 'react';
import {Component} from 'react';
import SimpleMediaCard from './SimpleMediaCard'
import styled from "styled-components"


const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

class UserProjects extends Component {
	constructor(props) {


	    super(props);
	    this.state = {
	    	content: []
	    };

	    console.log("username is: " + this.props.userId);

	    const loadContent = 'https://api.joinoasys.org/GetUserContentsPreview';
        const that = this;

	    fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            that.setState({content: myJson});

        });
	}

	render() {
		const userContents = this.state.content.filter(content => content.userId == this.props.userId);
		const contentList = userContents.map((d, i) => <SimpleMediaCard key={i} contentData={d}/> );

		return (
			<Flexer>
				{contentList}
			</Flexer>
			)
	}
}

export default UserProjects;