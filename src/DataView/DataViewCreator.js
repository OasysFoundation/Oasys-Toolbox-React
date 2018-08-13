import React, {Component} from 'react';
import {Card, CardBody, Container} from 'reactstrap';

class DataViewCreator extends Component {
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
                    <Container fluid className='paddingTop20'>
						<h3 style={{marginBottom: '0px'}}>Overview</h3>
						<hr style={{marginTop: '0px'}}/>
						<center>
							<Card className="card-fancy has-shadow" style={{width: '500px'}}>
								<CardBody className='flex-center'>
								{summaryStats.map((elem,idx) =>
									(idx<summaryStats.length-1)
									?(<div className='cell-center card-section border-right'>
										<p>{elem.label}</p>
										<p className='font-big'>{elem.value}</p>
									  </div>
									):(
									<div className='cell-center card-section'>
										<p>{elem.label}</p>
										<p className='font-big'>{elem.value}</p>
									</div>)
								)}
								</CardBody>
							</Card>
						</center>

						<h3 style={{marginBottom: '0px'}}>Summary</h3>
						<hr style={{marginTop: '0px'}}/>

						<h3 style={{marginBottom: '0px'}}>Details</h3>
						<hr style={{marginTop: '0px'}}/>
					</Container>
				</main>
			</div>
		)
	}
}

export default DataViewCreator;