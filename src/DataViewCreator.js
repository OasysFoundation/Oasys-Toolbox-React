import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { firebase } from './firebase';
//import d3 from 'd3';
import taucharts from 'taucharts';
//import TauChart from 'taucharts-react';
//import 'taucharts/css/tauCharts.css';
import './taucharts.min.css';

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
    if (Math.random() > 0.7) {
        let maxnr = Math.round(Math.random()*a.length);
        return a.slice(0,maxnr);
    } else {
        return a;
    }
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
    for (let i=0;i<4;i++) {
        let oneContentForUser = [];
        let nSlides = 20 - Math.round(Math.random() * 10);
        let nQuiz = 4 - Math.round(Math.random() * 3);
        let nUsers = 25 - Math.round(Math.random() * 10);
        for (let j=0;j<nUsers;j++) {
            let startTime = new Date();
            startTime.setTime(startTime.getTime() - Math.round(Math.random()*60*60*24*1000*30)); // startTime in interval [now-30 days, now]
            let endTime = new Date();
            endTime.setTime(startTime.getTime() + Math.round(Math.random()*60*24*1000)); 
            let slideTimings = generateFakeSlideTimes(nSlides);
            let quizAnswers = generateFakeQuizAnswers(nQuiz);
            let contentId = "content " + (i + 1);
            let duration = new Date();
            duration.setTime(endTime.getTime() - startTime.getTime());
            let content = {contentId: contentId, startTime: startTime, endTime: endTime, accessTimes: slideTimings, quizAnswers: quizAnswers, duration: duration}
            oneContentForUser.push(content);
        }
        allContentsForUser.push(oneContentForUser);
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
            a.push({slide: x[i].i, time: x[i].t});
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
        //this.loadContent();
    }

    loadContent() {
        const loadContent = 'https://api.joinoasys.org/getAllContentsForCreator/' + this.props.authUser.displayName;
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

    getAnswerElem(answer){
        if (answer) {
            return (<div style={styles.quizElemCorrect}></div>)
        } else {
            return (<div style={styles.quizElemWrong}></div>)
        }
    }

    showLastAcess(content) {
        console.log(content)
        let accessTime = null;
        if (content.endTime!==null) {
            accessTime = content.endTime;
        } else if (content.accessTimes != []) {
            accessTime = content.accessTimes[-1].t;
        } else {
            accessTime = content.startTime;
        }
        return accessTime.toLocaleDateString("en-US") + ", " + padNumber(accessTime.getHours())+ ":" + padNumber(accessTime.getMinutes());
    }

    formatTime(time) {
        return padNumber(time.getHours()-1) + "h:" + padNumber(time.getMinutes()) + "m:" + padNumber(time.getSeconds()) + "s";
    }


    renderBarChart(data, dim1, dim2, div) {
        var chart = new taucharts.Chart({
            data: data,
            type: 'bar',
            x: dim1,
            y: dim2
        });
        chart.renderTo(div);
    }

    rearrangeData(contents) {
        // find total number of slides. we should change this later by directly
        // importing the content, and looking up number of slides
        let nSlides = 0;
        for (let i=0; i<contents.length; i++) {
            nSlides = Math.max(nSlides, wrapTiming(contents[i].accessTimes).length);
        }
        let nQuiz = 0;
        for (let i=0; i<contents.length; i++) {
            nQuiz = Math.max(nQuiz, wrapTiming(contents[i].quizAnswers).length);
        }

        let usersPerSlide = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
        let timingTemplate = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
        let timings = []
        for (let i=0; i<contents.length; i++) {
            let timing = wrapTiming(contents[i].accessTimes).map(a => a.time);
            let tt = timingTemplate.slice();
            tt.splice(0, timing.length, ...timing);
            timings.push(tt);
            for (let j=0; j<timing.length; j++) {
                usersPerSlide[j]++;
            }
        }
        let timingsPerSlide = [...Array(nSlides)].map(e => Array(0));
        for (let i=0; i<timings.length; i++) {
            for (let j=0; j<timings[i].length; j++) {
                timingsPerSlide[j].push(timings[i][j])
            }
        }
        let answers = Array.apply(null, Array(nQuiz)).map(Number.prototype.valueOf,0);
        for (let i=0; i<contents.length; i++) {
            for (let j=0; j<contents[i].quizAnswers.length; j++) {
                if (contents[i].quizAnswers[j]) {
                    // TODO: this is inccorectly divided by the number of users that accessed the content.
                    // instead, it should be divided by the number of users who answered this quiz question.
                    answers[j] += 1 / contents.length;
                }
            }
        }
        console.log(answers)
        let data = {
            usersPerSlide: usersPerSlide, 
            timings: timings, 
            nSlides: nSlides, 
            timingsPerSlide: timingsPerSlide,
            answers: answers,
        }
        return data
    }

    renderAvgTimeSpent(data, idx) {
        let avgTimings = [];
        for (let i=0; i<data.timingsPerSlide.length; i++) {
            let sum = data.timingsPerSlide[i].reduce(function(a, b) { return a + b; });
            avgTimings.push({
                slide: i+1,
                time: sum/data.timingsPerSlide[i].length
            });
        }
        this.renderBarChart(avgTimings, "slide", "time", "#avgTime"+idx);
    }

    renderUsersPerSlide(data, idx) {
        let users = [];
        for (let i=0; i<data.usersPerSlide.length; i++) {
            users.push({
                slide: i+1,
                users: data.usersPerSlide[i]
            });
        }
        this.renderBarChart(users, "slide", "users", "#usersPerSlide"+idx);
    }

    renderQuizAnswers(data, idx) {
        let answers = [];
        for (let i=0; i<data.answers.length; i++) {
            answers.push({
                question: i+1,
                correct: data.answers[i]
            });
        }
        this.renderBarChart(answers, "question", "correct", "#quiz"+idx);
    }

    componentDidMount(){
        let contents = this.state.allContentsForUser;
        for (let i=0; i<contents.length; i++) {
            let data = this.rearrangeData(contents[i]);
            this.renderUsersPerSlide(data, i);
            this.renderAvgTimeSpent(data, i);
            this.renderQuizAnswers(data, i);

            //this.renderD3();
        }
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
             {this.state.allContentsForUser.map((content,i) => (
                <Paper zDepth={3} style={styles.paper}> 
                    <Typography gutterBottom component="p">
                        <strong>{content[0].contentId}</strong>
                        {" (#accessed: "+ content.length + ")"}
                    </Typography>

                    <Typography gutterBottom component="p">
                        {"Average number of users per slide"}
                    </Typography>
                    <div id={"usersPerSlide"+i} style={styles.barWrap}/>

                    <Typography gutterBottom component="p">
                        {"Average time spent on each slide"}
                    </Typography>
                    <div id={"avgTime"+i} style={styles.barWrap}/>

                    <Typography gutterBottom component="p">
                        {"Quiz answers"}
                    </Typography>
                    <div id={"quiz"+i} style={styles.quizWrap}/>
                </Paper>
             ))}
            </div>
        );
    }
}

export default DataView;
