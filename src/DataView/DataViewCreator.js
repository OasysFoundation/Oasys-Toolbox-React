import React, {Component} from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import ReactTooltip from "react-tooltip"

import colors from '../colors';
import DataOverview from './DataOverview';
import DataDetails from './DataDetails';

class DataViewCreator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			contentTitle: 'Bullshit detector'
		}
	}

	render(){
		let summaryStats = [
			{'label': 'Lessons', 'value': '0', 'help': 'Total number of lessons that you have created.', id: Math.random(36).toString()},
			{'label': 'Rating', 'value': 'N/A', 'help': 'Average rating of all your lessons.', id: Math.random(36).toString()},
			{'label': 'Learners', 'value': '0', 'help': 'How many learners have accessed your lessons.', id: Math.random(36).toString()},
			{'label': 'OAS token', 'value': '0', 'help': 'Amount of OAS tokens you have earned.', id: Math.random(36).toString()},
			{'label': 'Open feedback', 'value': '0', 'help': 'Amount of unread feedback from learners.', id: Math.random(36).toString()},
		]
		return ( 
			<div className="app-body">
                <main className="main dataview">
                    <Container fluid className='paddingTop20 paddingBottom20 main-width'>
						<h3 style={{marginBottom: '0px'}}>Overview</h3>
						<hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>
						<center>
							<Card className="card-fancy has-shadow">
								<CardBody className='flex-center'>
								{summaryStats.map((elem,idx) =>
									<div className={(idx<summaryStats.length-1) ? 'cell-center card-section border-right' : 'cell-center card-section'}>
										<p>
											{elem.label}
              								<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for={elem.id}></i></sup>
                    						<ReactTooltip id={elem.id}> {elem.help} </ReactTooltip>
										</p>
										<p className='font-big'>{elem.value}</p>
								    </div>
								)}
								</CardBody>
							</Card>
						</center>

						<h3 style={{marginBottom: '0px'}}>Summary</h3>
						<hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>

						<DataOverview/>

						<h3 style={{marginBottom: '0px', marginTop: '30px'}}>
							Details for lesson {this.state.contentTitle}
						</h3>
						<hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>

						<DataDetails contentTitle={this.state.contentTitle}/>

					</Container>
				</main>
			</div>
		)
	}
}

export default DataViewCreator;