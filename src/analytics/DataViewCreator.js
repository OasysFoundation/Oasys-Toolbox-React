// import external modules
import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ReactTooltip from "react-tooltip"
import IconHelpOutline from '@material-ui/icons/HelpOutline';
import IconTrendingUp from '@material-ui/icons/TrendingUp';
import IconTrendingFlat from '@material-ui/icons/TrendingFlat';
import IconTrendingDown from '@material-ui/icons/TrendingDown';
//import IconTrendingDown from '@material-ui/icons/TrendingDown';

import taucharts from 'taucharts';
import 'taucharts/dist/plugins/tooltip';
import 'taucharts/dist/plugins/layers';
import 'taucharts/dist/plugins/legend';

// import custom modules
import '../taucharts.min.css'; // we needed to modify this, so it's a custom import
import {summary, details} from './text'
import {styles} from './styles'
import {genSynthData} from './genSyntheticData'
import {rearrangeData} from './processData'
import api from "../tools";
//import glb from "../globals";
import {CoolPinkButton} from "../stylings";
import previewBackground from "../images/preview.png";

// TODO
// time spent per content as distribution
// age of learners as distribution
// time per question as distribution
// trending icons when showing statics for last week / month

const tauGuideDefault = {
    autoScale: false,
    showGridLines:'xy',
    x: {
        label: 'week',
        tickPeriod: 'week',
        tickFormat: 'week',
    }
}

const previewSummary = {
    margin: 20,
    backgroundImage: `url(${previewBackground})`,
    backgroundRepeat: 'repeat',
}

const previewDetails = {
    margin: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundImage: `url(${previewBackground})`,
    backgroundRepeat: 'repeat',
}


class DataView extends Component {

    constructor(props) {
        super(props);

        this.fake = false;
        if (window.location.pathname==="/data/preview") {
            this.fake = true;
        }

        this.state = {
            data: null,
        }

        this.rawdata = {
            contents: null,
            comments: null,
            ratings: null,
        }
        this.countApiCalls = 0;
        this.mounted = false;

        if (this.fake) {
            let rawdata = genSynthData();
            this.rawdata = rawdata;
            this.countApiCalls = 3;
            this.safelySetState();
        } else {
            let callback = (statevar, myJson) => {
                this.rawdata[statevar] = myJson;
                this.countApiCalls++; 
                // the page can only be safely rendered after a) the component has mounted and 
                // b) data has been successfully loaded from backend
                console.log(this.rawdata)
                if (this.countApiCalls===3) {
                    this.safelySetState();
                } 
            }

            api.getContentsForCreator(this.props.authUser).then(res => callback('contents', res));
            api.getCommentsForCreator(this.props.authUser).then(res => callback('comments', res));
            api.getRatingsForCreator(this.props.authUser).then(res => callback('ratings', res));
        }
    }

    componentDidMount(){
        this.mounted = true;
        if (this.countApiCalls === 3) {
            this.renderGraphs();
        }
    }

    safelySetState(){
        // correctly set state variable depending if component has finished mounting or not
        if (this.mounted) {
            this.setState({data: rearrangeData(this.rawdata)}, function(){
                this.renderGraphs();
            });
        } else {
            // provide hint of eslint (here it is actually safe to mutate state)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.data = rearrangeData(this.rawdata);
            if (this.mounted) {
                this.renderGraphs();
            }
        }
    }

    renderUsersPerSlide(data, idx) {
        if (data===undefined || data===null || data.length===0) {
            return;
        }

        var chart = new taucharts.Chart({
            data: data,
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

        if (data===undefined || data===null || data.length===0) {
            return;
        }

        var chart = new taucharts.Chart({
            data: data,
            type: "bar",
            x: "question",
            y: "correct",
            plugins: [taucharts.api.plugins.get('tooltip')()],
            settings: { fitModel: 'entire-view', },
        });
        chart.renderTo("#quiz"+idx);
    }

    renderChart(data, dim1, dim2, div, ylabel, type) {
        if (data===undefined || data===null || data.length===0) {
            return;
        }

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


    renderUsersPerWeek(data, num) { 
        if (num!==undefined) {
            this.renderChart(data, "week", "users", "#usersPerWeek"+num, "users", 'line');
        } else {
            this.renderChart(data, "week", "users", "#usersPerWeek", "users", 'line');
        }
    }

    renderRewardsPerWeek(data, num) {
        if (num!==undefined) {
            this.renderChart(data, "week", "rewards", "#rewardsPerWeek"+num, "OAS tokens", 'line');
        } else {
            this.renderChart(data, "week", "rewards", "#rewardsPerWeek", "OAS tokens", 'line');
        }
    }

    renderCommentsPerWeek(data) {
        this.renderChart(data, "week", "comments", "#commentsPerWeek", "comments", 'line');
    }

    renderGraphComponent(id, label) {
        return (
            <div style={styles.paperElem}>
                <Typography gutterBottom variant="subheading">
                    {label}
                </Typography>
                <div id={id} style={styles.graphWrap}/>
            </div>
        )
    }

    renderGraphComponentWide(id, label) {
        return (
            <div style={styles.paperElem}>
                <Typography gutterBottom variant="subheading">
                    {label}
                </Typography>
                <div id={id} style={styles.graphWrapWide}/>
            </div>
        )
    }

    renderIconTrend(trend) {
        if (trend===undefined || trend===null) {
            return;
        } else if (trend===-1) {
            return (<IconTrendingDown style={styles.trendingDown} />)
        } else if (trend===0) {
            return (<IconTrendingFlat style={styles.trendingFlat} />)
        } else if (trend===1) {
            return (<IconTrendingUp style={styles.trendingUp} />)
        } else { 
            return; 
        }
    }

    renderAnalyticsSummaryRow(obj, num, trend) {
        return (
            <tr>
                <td>
                    <Typography gutterBottom variant="body1">
                        {obj.text} <IconHelpOutline style={styles.smallIcon} data-tip='tooltip' data-for={obj.id} />
                    </Typography>
                    <ReactTooltip id={obj.id}> {obj.help} </ReactTooltip>
                </td>
                <td style={styles.summaryTableCell}>
                    <Typography gutterBottom variant="body1">
                        {num}
                        {this.renderIconTrend(trend)}
                    </Typography>
                </td>
            </tr>
        )
    }

    renderGraphs() {
        this.renderUsersPerWeek(this.state.data.usersPerWeek);
        this.renderRewardsPerWeek(this.state.data.rewardsPerWeek);
        this.renderCommentsPerWeek(this.state.data.commentsPerWeek);

        for (let i=0; i<this.state.data.contents.length; i++) {
            this.renderUsersPerSlide(this.state.data.contents[i].usersPerSlide, i);
            this.renderUsersPerWeek(this.state.data.contents[i].usersPerWeek, i);
            this.renderRewardsPerWeek(this.state.data.contents[i].rewardsPerWeek, i);
            this.renderQuizAnswers(this.state.data.contents[i].questions, i);
        }
    }

    renderOverview() {
        return (
            <div style={styles.flexContainer}>
                <div style={styles.paperElem}>
                    <Typography gutterBottom variant="subheading">
                        {"Summary statistics"}
                    </Typography>
                    <div id="summaryWrap">
                        <table className="textAlignLeft"><tbody>
                            {this.renderAnalyticsSummaryRow(summary.content, this.state.data.contents.length)}
                            {this.renderAnalyticsSummaryRow(summary.access, this.state.data.users)}
                            {this.renderAnalyticsSummaryRow(summary.comment, this.state.data.comments)}
                            {this.renderAnalyticsSummaryRow(summary.rating, this.state.data.rating)}
                            {this.renderAnalyticsSummaryRow(summary.tokens, 0)}
                        </tbody></table>
                    </div>
                </div>
                {this.renderGraphComponent("usersPerWeek", "Users per week")}
                {this.renderGraphComponent("rewardsPerWeek", "Rewards per week")}
                {this.renderGraphComponent("commentsPerWeek", "Comments per week")}
            </div>
        )
    }

    renderContentList() {
        return (
            <div>
                {this.state.data.contents.map((content,i) => (
                    <Paper style={this.fake ? previewDetails : styles.paperDetails}> 
                        <div style={styles.paperElem}>
                            <Typography gutterBottom variant="subheading">
                                {content.id}
                            </Typography>
                            <table className="textAlignLeft"><tbody>
                                {this.renderAnalyticsSummaryRow(details.access, content.users)}
                                {this.renderAnalyticsSummaryRow(details.comment, content.comments)}
                                {this.renderAnalyticsSummaryRow(details.rating, content.rating)}
                                {this.renderAnalyticsSummaryRow(details.tokens, 0)}
                            </tbody></table>
                        </div>
                        {this.renderGraphComponent("usersPerWeek"+i, "Users per week")}
                        {this.renderGraphComponent("rewardsPerWeek"+i, "Rewards per week")}
                        {this.renderGraphComponent("quiz"+i, "Answers correct")}
                        {this.renderGraphComponentWide("usersPerSlide"+i, "Users/Comments per slide")}
                    </Paper>
                 ))}
            </div>
        )
    }

    render() {
        return (
            <div style={styles.pageWrap}>
                <Typography gutterBottom variant="title">
                    {"Overview"}
                </Typography>
                <Paper style={this.fake ? previewSummary : styles.paperSummary} > 
                    { (this.state.data===null)
                    ?  <Typography gutterBottom variant="body1">
                            {"Loading content..."}
                       </Typography>
                    : this.renderOverview()
                    }
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
                <div id="contentList" >
                    { (this.state.data===null)
                    ?  null
                    : this.renderContentList()
                    }
                </div>
                {this.fake 
                ? null 
                :   <div>
                        <CoolPinkButton size="small" 
                                    data-tip='tooltip' 
                                    data-for='preview'
                                    onClick={function(){window.open('/data/preview', '_blank')}}>
                        Preview
                        </CoolPinkButton>
                        <ReactTooltip id="preview"> 
                            {"Show a preview of how this page looks like with more data"} 
                        </ReactTooltip>
                    </div>
                
                }
            </div>
        );
    }
}
document.body.style.overflowX = 'auto';

export default DataView;
