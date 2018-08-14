import React, {Component} from 'react';
import { Card, CardBody, CardHeader, Container } from 'reactstrap';
import { Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Bar, Line } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import colors, {hexToRgba} from '../colors';

let palette = [colors.GREEN, colors.TURQUOISE, colors.LOCHINVAR, colors.GHOST, colors.WINTERSUN, colors.SUMMERSUN, colors.RUST, colors.VELVET, colors.SPANISHWHITE];
let paletteRgba1 = palette.map(color=>hexToRgba(color,0.6));
let paletteRgba2 = palette.map(color=>hexToRgba(color,1.0));


const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

const barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderWidth: 1,
      hoverBackgroundColor: paletteRgba2,
      hoverBorderColor: paletteRgba2,
      data: [65, 59, 80, 81, 56, 55, 40, 22, 37],
    },
  ],
};

let options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  title: {
  	display: true,
  	fontSize: 16,
  	fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  	fontColor: '#666666',
  	text: 'My title',
  },
  legend: {
  	display: false,
  }
};

class DataDetails extends Component {

	constructor(props) {
		super(props);
	}
	
	render(){
		let optsUser = JSON.parse(JSON.stringify(options));
		let optsRewards = JSON.parse(JSON.stringify(options));
		optsUser.title.text = 'Users for lesson ' + this.props.contentTitle;
		optsRewards.title.text = 'Rewards for lesson ' + this.props.contentTitle;
		return (
			<div>
				<Card className='has-shadow marginBottom20'>
		            <CardBody>
		              <div className="chart-wrapper">
		                <Bar data={barData} options={optsUser} />
		              </div>
		            </CardBody>
	            </Card>
				<Card className='has-shadow'>
		            <CardBody>
		              <div className="chart-wrapper">
		                <Bar data={barData} options={optsRewards} />
		              </div>
		            </CardBody>
	            </Card>
			</div>
		)
	}
}

export default DataDetails;