import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { firebase } from './firebase';
import IconHelpOutline from '@material-ui/icons/HelpOutline';
import IconTrendingUp from '@material-ui/icons/TrendingUp';
import IconTrendingDown from '@material-ui/icons/TrendingDown';
//import d3 from 'd3';
import taucharts from 'taucharts';
import 'taucharts/dist/plugins/tooltip';
import 'taucharts/dist/plugins/layers';
import 'taucharts/dist/plugins/legend';
//import TauChart from 'taucharts-react';
//import 'taucharts/css/tauCharts.css';
import './taucharts.min.css';
import { withStyles } from '@material-ui/core/styles';
import d3 from 'd3';
import ReactTooltip from "react-tooltip"
import {summary} from './analytics/text'
import {styles} from './analytics/styles'
import {generateSlideTimes, generateQuizAnswers, generateSynthData} from './analytics/genSyntheticData'
import {rearrangeData} from './analytics/processData'


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
            allContentsForUser: generateSynthData(),
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

    showLastAccess(content) {
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

    renderLineChart(data, dim1, dim2, div, ylabel) {
        var chart = new taucharts.Chart({
            data: data,
            type: 'line',
            x: dim1,
            y: dim2,
            guide: {
                autoScale: false,
                showGridLines:'xy',
                x: {
                    label: {text: 'week of the year'},
                    tickPeriod: 'week',
                    tickFormat: 'week',
                },
                y: {
                    label: {text: ylabel}
                },
            },
            plugins: [
                taucharts.api.plugins.get('tooltip')()
            ],
            settings: {
                fitModel: 'entire-view',
            }
        });
        chart.renderTo(div);
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
                users: data.usersPerSlide[i],
                comments: Math.round(3*Math.random()),
            });
        }
        var chart = new taucharts.Chart({
            data: users,
            type: 'bar',
            x: 'slide',
            y: 'users',
            guide: {
                x: {
                    label: { text: 'slide' },
                },
                y: {
                    label: { text: 'users' }
                }
            },
            plugins: [
                taucharts.api.plugins.get('layers')({
                    mode: 'dock',
                    showPanel: false,
                    layers: [{
                            type: 'line',
                            y: ['comments'],
                            guide: {
                                    label: {
                                        byKeys: {
                                            comments: 'comments',
                                    }
                                },
                                scaleOrient: 'right',
                                textAnchor: 'start',
                                zIndex: -1
                            }
                    }]
                }),
                taucharts.api.plugins.get('legend')(),
            ]
        });
        chart.renderTo("#usersPerSlide"+idx);
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

    renderUsersPerWeek(num) {
        let data = [];
        const today = new Date();
        for (let i=0; i<8; i++) {
            let newDate = new Date();
            newDate.setDate(today.getDate() - 7*i);
            if (num!==undefined) {
                data.push({'week': newDate, 'users': Math.max(0,50 - i*Math.round(10*Math.random()))});
            } else {
                data.push({'week': newDate, 'users': Math.max(0,200 - i*Math.round(40*Math.random()))});
            }
        }
        if (num!==undefined) {
            this.renderLineChart(data, "week", "users", "#usersPerWeek"+num, "users");
        } else {
            this.renderLineChart(data, "week", "users", "#usersPerWeek", "users");
        }
    }

    renderRewardsPerWeek(num) {
        let data = [];
        const today = new Date();
        for (let i=0; i<8; i++) {
            let newDate = new Date();
            newDate.setDate(today.getDate() - 7*i);
            if (num!==undefined) {
                data.push({'week': newDate, 'rewards': 0.1*Math.random()})
            } else {
                data.push({'week': newDate, 'rewards': Math.random()})
            }
        } 
        if (num!==undefined) {
            this.renderLineChart(data, "week", "rewards", "#rewardsPerWeek"+num, "OAS tokens");
        } else {
            this.renderLineChart(data, "week", "rewards", "#rewardsPerWeek", "OAS tokens");
        }
    }

    renderCommentsPerWeek() {
        let data = [];
        const today = new Date();
        for (let i=0; i<8; i++) {
            let newDate = new Date();
            newDate.setDate(today.getDate() - 7*i);
            data.push({'week': newDate, 'comments': Math.round(6*Math.random())})
        }
        this.renderLineChart(data, "week", "comments", "#commentsPerWeek", "comments");
    }

    componentDidMount(){
        window.d3 = require('d3');
        let contents = this.state.allContentsForUser;
        this.renderUsersPerWeek();
        this.renderRewardsPerWeek();
        this.renderCommentsPerWeek();

        for (let i=0; i<contents.length; i++) {
            let data = rearrangeData(contents[i]);
            this.renderUsersPerSlide(data, i);
            this.renderUsersPerWeek(i);
            this.renderRewardsPerWeek(i);
            //this.renderAvgTimeSpent(data, i);
            //this.renderQuizAnswers(data, i);

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

    renderAnalyticsSummaryRow(obj, num){
        return (
            <tr>
                <td>
                    <Typography gutterBottom variant="body1">
                        {obj.text} <IconHelpOutline style={styles.smallIcon} data-tip='tooltip' data-for={obj.id} />
                        <ReactTooltip id={obj.id}> {obj.help} </ReactTooltip>
                    </Typography>
                </td>
                <td style={styles.summaryTableCell}>
                    <Typography gutterBottom variant="body1">
                        {num}
                        <IconTrendingUp style={styles.trendingUp} />
                    </Typography>
                </td>
            </tr>
        )
    }

    render() {
        return (
            <div style={styles.pageWrap}>
                <Typography gutterBottom variant="title">
                    {"Overview"}
                </Typography>
                    <Paper zDepth={3} style={styles.paperSummary}> 
                        <div style={styles.paperElem}>
                            <Typography gutterBottom variant="subheading">
                                {"Summary statistics"}
                            </Typography>
                            <div id="summaryWrap">
                                <table className="textAlignLeft">
                                    {this.renderAnalyticsSummaryRow(summary.content, this.state.allContentsForUser.length)}
                                    {this.renderAnalyticsSummaryRow(summary.comment, 38)}
                                    {this.renderAnalyticsSummaryRow(summary.rating, 4.1)}
                                    {this.renderAnalyticsSummaryRow(summary.tokens, 9.0)}
                                </table>
                            </div>
                        </div>
                        <div id="usersPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="subheading">
                                {"Users per week"}
                            </Typography>
                            <div id={"usersPerWeek"} style={styles.graphWrap}/>
                        </div>
                        <div id="rewardsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="subheading">
                                {"Rewards per week"}
                            </Typography>
                            <div id={"rewardsPerWeek"} style={styles.graphWrap}/>
                        </div>
                        <div id="commentsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="subheading">
                                {"Comments per week"}
                            </Typography>
                            <div id={"commentsPerWeek"} style={styles.graphWrap}/>
                        </div>
                    </Paper>

                <Typography gutterBottom variant="display1">
                    {"Content List"}
                </Typography>
                Sort by: <select onChange={this.onChangeSortOrder} style={{cursor:'pointer'}} >
                  <option value="0">{"newest"}</option>
                  <option value="1">{"most used"}</option>
                  <option value="2">{"highest rated"}</option>
                </select>
                 {this.state.allContentsForUser.map((content,i) => (
                    <Paper zDepth={3} style={styles.paperSummary}> 
                        <div style={styles.paperElem}>
                            <Typography gutterBottom variant="headline">
                                {content[0].contentId}
                            </Typography>
                            <br/>
                            <div id="summaryWrap">
                                <Typography gutterBottom variant="body1">
                                    {"This content was accessed " + 45 + " times."}
                                </Typography>
                                <Typography gutterBottom variant="body1">
                                    {"Total user feedback: " + 12 + " comments."}
                                </Typography>
                                <Typography gutterBottom variant="body1">
                                    {"Average user rating: " + (Math.max(2,Math.round(50*Math.random())/10)) + " stars."}
                                </Typography>
                                <Typography gutterBottom variant="body1">
                                    {"This content earned you " + (Math.round(10*Math.random()))/10 + " OAS tokens."}
                                </Typography>
                            </div>
                        </div>
                        <div id="usersPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="headline">
                                {"Users per week"}
                            </Typography>
                            <div id={"usersPerWeek"+i} style={styles.graphWrap}/>
                        </div>
                        <div id="rewardsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="headline">
                                {"Rewards per week"}
                            </Typography>
                            <div id={"rewardsPerWeek"+i} style={styles.graphWrap}/>
                        </div>
                        <div id="commentsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="headline">
                                {"Users/Comments per slide"}
                            </Typography>
                            <div id={"usersPerSlide"+i} style={styles.graphWrap}/>
                        </div>
                    </Paper>
                 ))}
            </div>
        );
    }
}
document.body.style.overflowX = 'auto';


/*
<Paper zDepth={3} style={styles.paper}> 
    <Typography gutterBottom component="p">
        <strong>{content[0].contentId}</strong>
        {" (#accessed: "+ content.length + ")"}
    </Typography>

    <Typography gutterBottom component="p">
        {"Average number of users per slide"}
    </Typography>
    <div id={"usersPerSlide"+i} style={styles.graphWrap}/>

    <Typography gutterBottom component="p">
        {"Average time spent on each slide"}
    </Typography>
    <div id={"avgTime"+i} style={styles.graphWrap}/>

    <Typography gutterBottom component="p">
        {"Quiz answers"}
    </Typography>
    <div id={"quiz"+i} style={styles.quizWrap}/>
</Paper>
*/

export default DataView;
