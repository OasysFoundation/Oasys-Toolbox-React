import React, {Component} from 'react';
import { Card, CardBody, Container } from 'reactstrap';

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
			{'label': 'Average rating', 'value': 'N/A'},
			{'label': 'Total plays', 'value': '0'},
			{'label': 'OAS token', 'value': '0'},
			{'label': 'Open feedback', 'value': '0'},
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
										<p>{elem.label}</p>
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