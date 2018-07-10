import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';

const allContentsForUser = {
    
}

class DataView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let options = {};
        let data = {datasets: [{data: [5, 23, 46, 36, 44, 52, 78]}]};
        let data2 = {datasets: [{data: [{x: 0.2, y: 0.4}, 
                                        {x: 0.8, y: 0.7}]}]};
        return (
            <div>
               <Line data={data} options={options} width="600" height="250"/>
               <Bar data={data2} />
            </div>
        );
    }
}

export default DataView;
