import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import taucharts from 'taucharts';
import './taucharts.min.css';

const CORRECT_ANSWER_DIV = "<div style='width:10px; height:10px; background-color: #00aa00; border: 1px solid #dddddd; float:left'></div>";
const WRONG_ANSWER_DIV   = "<div style='width:10px; height:10px; background-color: #aa0000; border: 1px solid #dddddd; float:left'></div>";


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
            a[x[i].i].time = a[x[i].i].time + x[i].t;
        } else {
            a.push({slide: i, time: x[i].t});
        }
    }
    console.log(a)
    return a;
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
            allContentsForUser: generateFakeData(),
        };
    }

    renderBarChart() {
        let contents = this.state.allContentsForUser;
        for (let i=0; i<contents.length; i++) {
            let timing = wrapTiming(contents[i].slideTimings);
            var chart = new taucharts.Chart({
                data: timing,
                type: 'bar',
                x: 'slide',
                y: 'time'
            });
            chart.renderTo('#bar'+i);
        }
    }

    renderQuiz(){
        let contents = this.state.allContentsForUser;
        for (let i=0; i<contents.length; i++) {
            let elem = document.getElementById('quiz'+i);
            let answers = contents[i].quizAnswers;
            let domStr = "";
            for (let j=0; j<answers.length; j++) {
                if (answers[j]===false){
                    domStr = domStr + WRONG_ANSWER_DIV;
                } else {
                    domStr = domStr + CORRECT_ANSWER_DIV;
                }
            }
            elem.innerHTML = domStr;
        }
    }

    componentDidMount(){
        this.renderBarChart();
        this.renderQuiz();
    }

    render() {
        let options = {};
        let data = {datasets: [{data: [5, 23, 46, 36, 44, 52, 78]}]};
        let data2 = {datasets: [{data: [{x: 0.2, y: 0.4}, 
                                        {x: 0.8, y: 0.7}]}]};
        return (
            <div>
             {this.state.allContentsForUser.map((slide,i) => (
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
                    <div id={"quiz"+i}></div><br/>
                    <Typography gutterBottom component="p">
                        {"slideTiming: " + slide.slideTimings.map(x => "slide " + x.i.toString() + "(" + padNumber(Math.floor(x.t / 60)) + ":" + padNumber(Math.ceil(x.t % 60)) + ")")}
                    </Typography>
                    <div id={"bar"+i}></div>
                </div>
             ))}
               <Line data={data} options={options} width="600" height="250"/>
            </div>
        );
    }
}

export default DataView;
