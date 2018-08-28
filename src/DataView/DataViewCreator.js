import React, {Component} from 'react';
import {Container} from 'reactstrap';


import {connect} from 'redux-zero/react';

import DataOverview from './DataOverview';
import DataDetails from './DataDetails';
import api from '../utils/api';

import {rearrangeData} from './processData';

import {isMobile} from '../utils/tools'

/*
const allLessons = [
	{
		'title': 'Bullshit detector',
		'rating': 4.4,
		'learner': 100,
		'token': 5,
		'published': new Date(),
		'id': Math.random(36).toString(),
	},
	{
		'title': 'Energy is esoteric',
		'rating': 4.2,
		'learner': 200,
		'token': 2,
		'published': new Date(),
		'id': Math.random(36).toString(),

	},
	{
		'title': 'Atoms are not atomic',
		'rating': 4.3,
		'learner': 1000,
		'token': 200,
		'published': new Date(),
		'id': Math.random(36).toString(),
	},
];
*/


class DataViewCreator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDataIdx: -1, // -1 means summary
            lessons: [],
            summaryDone: false,
        };
        this.rawdata = {
            contents: [],
            ratings: [],
        };
        this.summary = {
            'title': 'All lessons',
            'rating': 0,
            'learner': 0,
            'id': 'all',
        }
        this.contentOverview = [];
        this.apiSuccessCount = 0;
        this.onChangeData = this.onChangeData.bind(this);
    }

    onChangeData(idx) {
        this.setState({currentDataIdx: idx});
    }

    componentWillReceiveProps(nextProps) {
        //firebase auth takes longer if loading the link directly per URL
        console.log(nextProps.user.uid)
        if (!nextProps.user.uid) {
            return
        }

        api.getUserContentsPreview().then(results => {
            console.log(results)
            let lessons = [];
            results.forEach((lesson,idx)=>{
                lessons.push({
                    id: lesson.contentId,
                    idx: idx,
                    rating: lesson.rating.mean,
                    title: lesson.title,
                    learner: lesson.views,
                    learnerPerWeek: [],
                    token: 0,
                    tokenPerWeek: [],
                    published: new Date(lesson.birthday).toLocaleDateString("en-US"),
                });
            });
            this.setState({lessons: lessons});
            this.contentOverview = results;
            this.apiSuccessCount++;
            if (this.apiSuccessCount===3) { this.showAnalytics(); }
        }).catch(err => console.log(err));

        api.getContentsForCreator(nextProps.user).then(result => {
            this.rawdata['contents'] = result;
            this.apiSuccessCount++;
            if (this.apiSuccessCount===3) { this.showAnalytics(); }
        }).catch(err => console.log(err));

        api.getRatingsForCreator(nextProps.user).then(result => {
            this.rawdata['ratings'] = result.map(obj => obj.rating);
            this.apiSuccessCount++;
            if (this.apiSuccessCount===3) { this.showAnalytics(); }
        }).catch(err => console.log(err));
    }

    getSummary(lessons) {
        if (lessons.length>0) {
            this.summary.rating = lessons.map(e => e.rating)
                .filter(e => !isNaN(e))
                .reduce((a, b, idx, arr) => a + b / arr.length, 0)
                .toFixed(1);
            this.summary.learner = lessons.map(e => e.learner)
                .reduce((a, b) => a + b);
            this.summary.token = lessons.map(e => e.token)
                .reduce((a, b) => a + b);
            this.summary.learnerPerWeek = lessons[0].learnerPerWeek;
            lessons.forEach(lesson=>{
                lesson.learnerPerWeek.forEach((week,idx)=>{
                    this.summary.learnerPerWeek[idx].users += week.users;
                })
            })
        }
        this.setState({summaryDone: true});
    }

    showAnalytics() {
        /* TODO
        quiz objects are now saved like so:
            type: this.state.quizType,
            correct: isCorrectAnswer,
            startTime: this.analytics.startTime,
            duration: this.analytics.endTime - this.analytics.startTime,
            id: this.props.id
        elements report into timings array like so:
            id: this.props.data.id,
            type: this.props.data.type,
            visible: isVisible,
            time: new Date(),
        */

        this.data = rearrangeData(this.rawdata);

        let lessons = JSON.parse(JSON.stringify(this.state.lessons));
        this.data.contents.forEach(content => {
            // update this.state.lessons
            let lessonIdx = this.state.lessons.findIndex(lesson=>lesson.id===content.id);
            let lesson = lessons[lessonIdx];
            lesson.learnerPerWeek = content.usersPerWeek;
        });
        console.log(this.rawdata);
        console.log(this.data);
        console.log(this.state.lessons);
        
        this.getSummary(lessons);
        this.setState({lessons: lessons});
    }

    render() {
        const paddingVal = (isMobile() ? "60px" : "10px");
        return (
            <div className="app-body">
                <main className="main dataview">
                    <Container fluid className='paddingTop20 paddingBottom20 main-width'
                               style={{paddingTop: paddingVal}}>
                        {/*
						<h3 style={{marginBottom: '0px'}}>Overview</h3>
						<hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>
						<center>
							<Card className="card-fancy has-shadow">
								<CardBody className='flex-center'>
								{summaryStats.map((elem,idx) =>
									<div className={(idx<summaryStats.length-1) ? 'cell-center card-section border-right' : 'cell-center card-section'}>
										<p>
											{elem.label}
              								<sup><i className="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for={elem.id}></i></sup>
                    						<ReactTooltip id={elem.id}> {elem.help} </ReactTooltip>
										</p>
										<p className='font-big'>{elem.value}</p>
								    </div>
								)}
								</CardBody>
							</Card>
						</center>
						*/}

                        { this.props.user.displayName === undefined
                            ? <p>Please <a href="/account">log in</a> to see your analytics.</p>
                            : this.apiSuccessCount<3
                                ?
                                <h3>
                                    Loading analytics...
                                </h3>
                                :
                                this.state.lessons.length===0
                                    ? <p>You need to <a href="/create">create a lesson</a> to see analytics here.</p>
                                    : <React.Fragment>
                                        <DataOverview
                                            onChangeData={this.onChangeData}
                                            data={this.state.lessons}
                                        />
                                        {/*this.state.summaryDone
                                            ?
                                            <DataDetails
                                                contentTitle={this.state.contentTitle}
                                                data={this.state.currentDataIdx === -1
                                                    ? this.summary
                                                    : this.state.lessons[this.state.currentDataIdx]
                                                }
                                            />
                                            : null
                                        */}
                                    </React.Fragment>
                        }
                    </Container>
                </main>
            </div>
        )
    }
}


const mapStoreToProps = ({user}) => ({user});
export default connect(mapStoreToProps, {})(DataViewCreator);
