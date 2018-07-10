import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';

const allContentsForUser = [];

generateFakeSlideTimes(n) {
    a = [];
    let i=0;
    while(true) {
        a.push({i: i, t: Math.random()*1000*60)}); // max 1 minute per slide
        if (i==n) { break; }
        else if (Math.random() > 0.9 && i > 0) { i--; }
        else {i++; }
    }
    return a;
}


generateFakeQuizAnswers(n) {
    a = [];
    for (let i=0; i<n; i++) {
        if (Math.random() > 0.7) {
            a.push(false);
        } else {
            a.push(true);
        }
    }
}

generateFakeData(){
    for (let =0;i<5;i++) {
        let nSlides = 20 - Math.round(Math.random() * 10);
        let nQuiz = 4 - Math.round(Math.random() * 3);
        let startTime = new Date() - Math.random()*1000*60*60*24*30 // startTime in interval [now-30 days, now]
        let endTime = startTime + Math.random()*1000*60*60 
        let slideTimings = generateFakeSlideTimes(nSlides)
        let quizAnswers = generateFakeQuizAnswers(nQuiz)
        content = {startTime: startTime, endTime: endTime, slideTimings: slideTimings, quizAnswers: quizAnswer}
        allContentsForUser.push(content);
    }

}

class DataView extends Component {

    constructor(props) {
        super(props);
        generateFakeData();
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
