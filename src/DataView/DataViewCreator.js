import React, {Component} from 'react';
import { Container } from 'reactstrap';

import DataOverview from './DataOverview';
import DataDetails from './DataDetails';


const allLessons = [
	{
		'title': 'Bullshit detector',
		'rating': 4.4,
		'learner': 100,
		'token': 5,
		'published': new Date(),
		'id': Math.random(36).toString(),
	},
	{
		'title': 'Energy is esoteric',
		'rating': 4.2,
		'learner': 200,
		'token': 2,
		'published': new Date(),
		'id': Math.random(36).toString(),

	},
	{
		'title': 'Atoms are not atomic',
		'rating': 4.3,
		'learner': 1000,
		'token': 200,
		'published': new Date(),
		'id': Math.random(36).toString(),
	},
];


class DataViewCreator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataId: 'all',
		}
		this.summaryData = {
			'title': 'All lessons',
			'rating': 0,
			'learner': 0,
			'published': 0,
			'id': 'all',
		}
		this.state = {currentData: this.summaryData};
	}

	onChangeData(id) {
		if (id==='all') {
			this.setState({currentData:this.summaryData});
		} else {
			this.setState({currentData:allLessons.filter(l=>l.id===id)[0]});
		}
	}

	render(){
		return ( 
			<div className="app-body">
                <main className="main dataview">
                    <Container fluid className='paddingTop20 paddingBottom20 main-width'>
            			{/*
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
						*/}

						<DataOverview 
							onChangeData={this.onChangeData.bind(this)}
							data={allLessons}
						/>

						<DataDetails 
							contentTitle={this.state.contentTitle} 
							dataId={this.state.dataId} 
							data={this.state.currentData}
						/>

					</Container>
				</main>
			</div>
		)
	}
}

export default DataViewCreator;