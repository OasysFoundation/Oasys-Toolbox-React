import React, {Component} from 'react';
import { Card, CardBody } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import colors, {hexToRgba} from '../colors';

let palette = [
  colors.GREEN, colors.TURQUOISE, colors.LOCHINVAR, 
  colors.GULLGREY, colors.WINTERSUN, colors.SUMMERSUN, 
  colors.BROWN, colors.RUST, colors.VELVET, 
  colors.MOUNTBATTEN, colors.GHOST, colors.GREY,
];
let paletteRgba1 = palette.map(color=>hexToRgba(color,0.7));
let paletteRgba2 = palette.map(color=>hexToRgba(color,1.0));

const chartHeight = '250px';

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
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderWidth: 1,
      hoverBackgroundColor: paletteRgba2,
      hoverBorderColor: paletteRgba2,
      data: [65, 59, 80, 81, 56, 55, 40, 22, 37, 10, 20, 30],
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
  },
  scales: {
     yAxes: [{
         ticks: {
             beginAtZero: true
         }
     }]
 }
};

class DataDetails extends Component {

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
		              	<center>
		                	<Bar data={barData} options={optsUser} height={chartHeight} />
		                </center>
		              </div>
		            </CardBody>
	            </Card>
				<Card className='has-shadow'>
		            <CardBody>
		              <div className="chart-wrapper">
		              	<center>
		                	<Bar data={barData} options={optsRewards} height={chartHeight} />
		                </center>
		              </div>
		            </CardBody>
	            </Card>
			</div>
		)
	}
}

export default DataDetails;