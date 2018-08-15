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

        <h3 style={{marginBottom: '0px', marginTop: '30px'}}>
          {(this.props.data.id==='all')
          ? ('Details for all lessons')
          : ('Details for lesson ' + this.props.data.title)
          }
        </h3>
        <hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>

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