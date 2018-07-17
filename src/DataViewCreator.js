// import external modules
import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { firebase } from './firebase';
import { withStyles } from '@material-ui/core/styles';
import ReactTooltip from "react-tooltip"
import IconHelpOutline from '@material-ui/icons/HelpOutline';
import IconTrendingUp from '@material-ui/icons/TrendingUp';
import IconTrendingDown from '@material-ui/icons/TrendingDown';

import taucharts from 'taucharts';
import 'taucharts/dist/plugins/tooltip';
import 'taucharts/dist/plugins/layers';
import 'taucharts/dist/plugins/legend';

// import custom modules
import './taucharts.min.css'; // we needed to modify this, so it's a custom import
import {summary, details} from './analytics/text'
import {styles} from './analytics/styles'
import {generateSlideTimes, generateQuizAnswers, generateSynthData} from './analytics/genSyntheticData'
import {rearrangeData, getLastAccess, formatTime} from './analytics/processData'

const hostname = 'https://api.joinoasys.org'
function apiCall(name) {
    return hostname + '/getAllContentsForCreator/' + this.props.authUser.displayName;
}

const tauGuideDefault = {
    autoScale: false,
    showGridLines:'xy',
    x: {
        label: 'week',
        tickPeriod: 'week',
        tickFormat: 'week',
    }
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
        const that = this;

        fetch(apiCall(this.props.authUser.displayName), {
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
                x: { label: { text: 'slide' }},
                y: { label: { text: 'users' }},
            },
            settings: { fitModel: 'entire-view', },
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
                taucharts.api.plugins.get('tooltip')(),
            ]
        });
        chart.renderTo("#usersPerSlide"+idx);
    }

    renderQuizAnswers(data, idx) {
        let answers = [];
        for (let i=0; i<data.answers.length; i++) {
            answers.push({
                question: i+1,
                correct: data.answers[i],
            });
        }
        var chart = new taucharts.Chart({
            data: answers,
            type: "bar",
            x: "question",
            y: "correct",
            plugins: [taucharts.api.plugins.get('tooltip')()],
            settings: { fitModel: 'entire-view', },
        });
        chart.renderTo("#quiz"+idx);
        //this.renderChart(answers, "question", "correct", "#quiz"+idx, 'correct', 'bar');
    }

    renderChart(data, dim1, dim2, div, ylabel, type) {
        const guide = Object.assign({y: {label: {text: ylabel}}}, tauGuideDefault);

        var chart = new taucharts.Chart({
            data: data,
            type: type,
            x: dim1,
            y: dim2,
            guide: guide,
            plugins: [taucharts.api.plugins.get('tooltip')()],
            settings: { fitModel: 'entire-view', }
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
        this.renderChart(avgTimings, "slide", "time", "#avgTime"+idx, 'bar');
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
            this.renderChart(data, "week", "users", "#usersPerWeek"+num, "users", 'line');
        } else {
            this.renderChart(data, "week", "users", "#usersPerWeek", "users", 'line');
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
            this.renderChart(data, "week", "rewards", "#rewardsPerWeek"+num, "OAS tokens", 'line');
        } else {
            this.renderChart(data, "week", "rewards", "#rewardsPerWeek", "OAS tokens", 'line');
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
        this.renderChart(data, "week", "comments", "#commentsPerWeek", "comments", 'line');
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
            this.renderQuizAnswers(data, i);

            //this.renderD3();
        }

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
                                    {this.renderAnalyticsSummaryRow(summary.access, 498)}
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
                <div style={styles.flexContainer}>
                    <Typography gutterBottom variant="title">
                        {"Content List"}
                    </Typography>
                    <span style={styles.marginLeft}>Sort by: </span>
                    <select onChange={this.onChangeSortOrder} style={styles.marginLeft}>
                      <option value="0">{"newest"}</option>
                      <option value="1">{"most used"}</option>
                      <option value="2">{"highest rated"}</option>
                    </select>
                </div>
                 {this.state.allContentsForUser.map((content,i) => (
                    <Paper zDepth={3} style={styles.paperSummary}> 
                        <div style={styles.paperElem}>
                            <Typography gutterBottom variant="title">
                                {content[0].contentId}
                            </Typography>
                            <table className="textAlignLeft">
                                {this.renderAnalyticsSummaryRow(details.access, 50)}
                                {this.renderAnalyticsSummaryRow(details.comment, 10)}
                                {this.renderAnalyticsSummaryRow(details.rating, 4.0)}
                                {this.renderAnalyticsSummaryRow(details.tokens, 1.0)}
                            </table>
                        </div>
                        <div id="usersPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="title">
                                {"Users per week"}
                            </Typography>
                            <div id={"usersPerWeek"+i} style={styles.graphWrap}/>
                        </div>
                        <div id="rewardsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="title">
                                {"Rewards per week"}
                            </Typography>
                            <div id={"rewardsPerWeek"+i} style={styles.graphWrap}/>
                        </div>
                        <div id="commentsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="title">
                                {"Quiz answers"}
                            </Typography>
                            <div id={"quiz"+i} style={styles.graphWrap}/>
                        </div>
                        <div id="commentsPerWeekWrap" style={styles.paperElem}>
                            <Typography gutterBottom variant="title">
                                {"Users/Comments per slide"}
                            </Typography>
                            <div id={"usersPerSlide"+i} style={styles.graphWrapWide}/>
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
