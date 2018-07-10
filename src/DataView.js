import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import taucharts from 'taucharts';
import './taucharts.min.css';

const BARWIDTH = 400;
const BARHEIGHT = 200;


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

function wrapTiming(x) {
    let a = [];
    for (let i=0; i<x.length; i++) {
        if (x[i].i < a.length) {
            a[x[i].i] = a[x[i].i] + x[i].t;
        } else {
            a.push(x[i].t);
        }
    }
    let data = {
        labels: new Array(a.length).fill(1).map((e,i) => i+1),
        datasets: [{
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: a,
    }]};

    return data;
}

function getBarOptions() {
    return {
        maintainAspectRatio: false, 
        title: {display: false},
        scales: {xAxes: [{labelString: 'slide number'}],
                 yAxes: [{labelString: 'time [s]'}]}
    }
}

class DataView extends Component {

    constructor(props) {
        console.log(taucharts)
        super(props);
        this.state = {
            allContentsForUser: generateFakeData()
        };
    }

    renderBarChart() {
        var defData = [
            {"team": "d", "cycleTime": 1, "effort": 1, "count": 1, "priority": "low"}, {
                "team": "d",
                "cycleTime": 2,
                "effort": 2,
                "count": 5,
                "priority": "low"
            }, {"team": "d", "cycleTime": 3, "effort": 3, "count": 8, "priority": "medium"}, {
                "team": "d",
                "cycleTime": 4,
                "effort": 4,
                "count": 3,
                "priority": "high"
            }, {"team": "l", "cycleTime": 2, "effort": 1, "count": 1, "priority": "low"}, {
                "team": "l",
                "cycleTime": 3,
                "effort": 2,
                "count": 5,
                "priority": "low"
            }, {"team": "l", "cycleTime": 4, "effort": 3, "count": 8, "priority": "medium"}, {
                "team": "l",
                "cycleTime": 5,
                "effort": 4,
                "count": 3,
                "priority": "high"
            },
            {"team": "k", "cycleTime": 2, "effort": 4, "count": 1, "priority": "low"}, {
                "team": "k",
                "cycleTime": 3,
                "effort": 5,
                "count": 5,
                "priority": "low"
            }, {"team": "k", "cycleTime": 4, "effort": 6, "count": 8, "priority": "medium"}, {
                "team": "k",
                "cycleTime": 5,
                "effort": 8,
                "count": 3,
                "priority": "high"
            }];
        var chart = new taucharts.Chart({
            data: defData,
            type: 'bar',
            x: 'team',
            y: 'effort'
        });
        chart.renderTo('#bar');
    }

    componentDidMount(){
        this.renderBarChart()
    }

    render() {
        let options = {};
        let data = {datasets: [{data: [5, 23, 46, 36, 44, 52, 78]}]};
        let data2 = {datasets: [{data: [{x: 0.2, y: 0.4}, 
                                        {x: 0.8, y: 0.7}]}]};
        return (
            <div>
             {this.state.allContentsForUser.map(slide => (
                <div>
                    <div id="bar"></div>
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
                    <div style={{width: BARWIDTH, height: BARHEIGHT}}>
                        <Bar data={wrapTiming(slide.slideTimings)} options={getBarOptions()} />
                    </div>
                </div>
             ))}
               <Line data={data} options={options} width="600" height="250"/>
            </div>
        );
    }
}

export default DataView;
