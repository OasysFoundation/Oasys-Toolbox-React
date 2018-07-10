import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';


function generateFakeSlideTimes(n) {
    let a = [];
    let i=0;
    while(true) {
        a.push({i: i, t: Math.random()*60}); // max 1 minute per slide
        if (i==n) { break; }
        else if (Math.random() > 0.9 && i > 0) { i--; }
        else {i++; }
    }
    return a;
}


function generateFakeQuizAnswers(n) {
    let a = [];
    for (let i=0; i<n; i++) {
        if (Math.random() > 0.7) {
            a.push(false);
        } else {
            a.push(true);
        }
    }
    return a;
}

 function generateFakeData(){
    let allContentsForUser = [];
    for (let i=0;i<5;i++) {
        let nSlides = 20 - Math.round(Math.random() * 10);
        let nQuiz = 4 - Math.round(Math.random() * 3);
        let startTime = new Date();
        startTime.setTime(startTime.getTime() - Math.round(Math.random()*60*60*24*1000*30)); // startTime in interval [now-30 days, now]
        let endTime = new Date();
        endTime.setTime(startTime.getTime() + Math.round(Math.random()*60*24*1000)); 
        let slideTimings = generateFakeSlideTimes(nSlides);
        let quizAnswers = generateFakeQuizAnswers(nQuiz);
        let contentId = "content " + (i + 1);
        let duration = new Date();
        duration.setTime(endTime.getTime() - startTime.getTime());
        let content = {contentId: contentId, startTime: startTime, endTime: endTime, slideTimings: slideTimings, quizAnswers: quizAnswers, duration: duration}
        allContentsForUser.push(content);
    }
    return allContentsForUser;
}

function padNumber(x) {
    return x.toString().padStart(2,'0')
}

class DataView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allContentsForUser: generateFakeData()
        };
    }

    render() {
        let options = {};
        let data = {datasets: [{data: [5, 23, 46, 36, 44, 52, 78]}]};
        let data2 = {datasets: [{data: [{x: 0.2, y: 0.4}, 
                                        {x: 0.8, y: 0.7}]}]};
        console.log(this.state.allContentsForUser);
        return (
            <div>
             {this.state.allContentsForUser.map(slide => (
                <div>
                    <Typography gutterBottom variant="headline" component="h2">
                        {slide.contentId}
                    </Typography>
                    <Typography gutterBottom component="p">
                        {"last accessed: "+ slide.endTime.toLocaleDateString("en-US") + ", " + padNumber(slide.endTime.getHours())+ ":" + padNumber(slide.endTime.getMinutes())}
                    </Typography>
                    <Typography gutterBottom component="p">
                        {"duration: "+ padNumber(slide.duration.getHours()-1) + "h:" + padNumber(slide.duration.getMinutes()) + "m:" + padNumber(slide.duration.getSeconds()) + "s"}
                    </Typography>
                    <Typography gutterBottom component="p">
                        {"quiz: " + slide.quizAnswers.map(answer => answer.toString())}
                    </Typography>
                    <Typography gutterBottom component="p">
                        {"slideTiming: " + slide.slideTimings.map(x => "slide " + x.i.toString() + "(" + padNumber(Math.floor(x.t / 60)) + ":" + padNumber(Math.ceil(x.t % 60)) + ")")}
                    </Typography>
                </div>
             ))}
               <Line data={data} options={options} width="600" height="250"/>
               <Bar data={data2} />
            </div>
        );
    }
}

export default DataView;
