import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { firebase } from './firebase';
//import d3 from 'd3';
import taucharts from 'taucharts';
//import TauChart from 'taucharts-react';
//import 'taucharts/css/tauCharts.css';
import './taucharts.min.css';

// TODO: time spent on platform per day
// TODO: what are the last few contents for which I did not get all answers right

const styles = {
  paperWrap:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    width: '800px'
  },
  paper:{
    width: '350px',
    margin: 10,
    textAlign: 'center',
    padding: 10
  },
  quizWrap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizElemCorrect: {
    width: '10px',
    height: '10px', 
    backgroundColor: '#00aa00', 
    border: '1px solid #dddddd',
  },
  quizElemWrong: {
    width: '10px',
    height: '10px', 
    backgroundColor: '#aa0000', 
    border: '1px solid #dddddd',
  },
  marginRight: {
    marginRight: '5px',
  },
  barWrap: {
    height: '150px',
    width: '350px',
  }
};

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
    return a;
}

class DataView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            allContentsForUser: generateFakeData(),
        }
        this.loadContent();

    }

    loadContent() {
        const loadContent = 'https://api.joinoasys.org/getAllContentsForUser/' + this.props.authUser.displayName;
        console.log(loadContent)
        const that = this;

        fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            that.setState({data: myJson});

        });
    }

    renderBarChart() {
        let contents = this.state.allContentsForUser;
        for (let i=0; i<contents.length; i++) {
            let timing = wrapTiming(contents[i].slideTimings);
            var chart = new taucharts.Chart({
                data: timing,
                type: 'bar',
                x: 'slide',
                y: 'time',
                dimensions: {
                    slide    : { type: 'measure', scale: 'linear' },
                    time    : { type: 'measure', scale: 'linear' }
                }
            });
            chart.renderTo('#bar'+i);
        }
    }

    getAnswerElem(answer){
        if (answer) {
            return (<div style={styles.quizElemCorrect}></div>)
        } else {
            return (<div style={styles.quizElemWrong}></div>)
        }
    }

    formatTimeDate(time) {
        return time.toLocaleDateString("en-US") + ", " + padNumber(time.getHours())+ ":" + padNumber(time.getMinutes());
    }

    formatTime(time) {
        return padNumber(time.getHours()-1) + "h:" + padNumber(time.getMinutes()) + "m:" + padNumber(time.getSeconds()) + "s";
    }

    componentDidMount(){
        this.renderBarChart();
        //this.renderD3();
    }

    renderD3(){
        /*let data = [4,8,12];
        d3.select(".d3chart")
          .selectAll("div")
            .data(data)
          .enter().append("div")
            .style("width", function(d) { return d * 10 + "px"; })
            .text(function(d) { return d; });
        */
    }

    render() {
        return (
            <div style={styles.paperWrap}>
             <div id={"d3chart"}>
                <div style={{"width": "40px"}}>4</div>
                <div style={{"width": "80px"}}>8</div>
                <div style={{"width": "120px"}}>12</div>
             </div>
             {this.state.allContentsForUser.map((slide,i) => (
                <Paper zDepth={3} style={styles.paper}> 
                    <Typography gutterBottom component="p">
                        <strong>{slide.contentId}</strong>
                        {" (accessed: "+ this.formatTimeDate(slide.endTime) + ")"}
                    </Typography>
                    <Typography gutterBottom component="p">
                        {"time spent with content: "+ this.formatTime(slide.duration)}
                    </Typography>
                    <div id={"quiz"+i} style={styles.quizWrap}>
                        <Typography gutterBottom component="p" style={styles.marginRight}>
                            {"quiz answers: "}
                        </Typography>
                        {slide.quizAnswers.map(answer => (
                            this.getAnswerElem(answer)
                        ))}
                    </div>
                    <div id={"bar"+i} style={styles.barWrap}/>
                </Paper>
             ))}
            </div>
        );
    }
}

export default DataView;
