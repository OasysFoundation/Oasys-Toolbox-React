import React, {Component} from 'react';
import {Container} from "reactstrap"

class AboutPage extends Component {
	render(){
		return ( 
			<div className="app-body">
                <main className="main">
                    <Container fluid>
						<h1>About Oasys</h1>
					</Container>
				</main>
			</div>
		)
	}
}

export default AboutPage;