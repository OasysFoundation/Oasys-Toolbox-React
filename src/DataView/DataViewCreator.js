import React, {Component} from 'react';
import { Container } from 'reactstrap';
import {connect} from 'redux-zero/react';

import DataOverview from './DataOverview';
import DataDetails from './DataDetails';
import api from '../utils/api';

import {rearrangeData} from './processData';

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
		this.rawdata = {
			contents: [],
			ratings: [],
		};

		this.summary = {
			'title': 'All lessons',
			'rating': 0,
			'learner': 0,
			'published': 0,
			'id': 'all',
		}

		this.state = {
			currentDataIdx: -1, // -1 means summary
			lessons: [],
		};
		this.onChangeData = this.onChangeData.bind(this);
	}

	onChangeData(idx) {
		this.setState({currentDataIdx:idx});
	}

	checkMobile() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    componentDidMount() {
    	if (this.props.user.displayName===undefined) {
    		console.log('ERROR: undefined user');
    		return;
    	}
    	api.getContentsForCreator(this.props.user).then(result => {
    		this.rawdata['contents'] = result;
    		if (this.rawdata['ratings']!==[]) { this.showAnalytics(); }
        }).catch(err => console.log(err));

		api.getRatingsForCreator(this.props.user).then(result => {
    		this.rawdata['ratings'] = result;
    		if (this.rawdata['contents']!==[]) { this.showAnalytics(); }
        }).catch(err => console.log(err));
    }

    getSummary(lessons) {
    	this.summary.rating = lessons.map(e=>e.rating)
						    		.filter(e=>!isNaN(e))
						    		.reduce((a,b,idx,arr)=>a+b/arr.length,0)
						    		.toFixed(1);
    	this.summary.learner = lessons.map(e=>e.learner)
			            			.reduce((a,b)=>a+b);
    	this.summary.token = lessons.map(e=>e.token)
			            			.reduce((a,b)=>a+b);
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
        check if content finish screen posts an endTime
    	*/

    	this.data = rearrangeData(this.rawdata);
    	console.log(this.data)

    	let lessons = [];
    	this.data.contents.forEach((content,idx) => {
    		lessons.push({
    			title: content.id,
    			rating: content.rating,
    			learner: content.users,
    			learnerPerWeek: content.usersPerWeek,
    			questions: content.questions,
    			timeSpent: [],
    			token: 0,
    			published: new Date(1963,1,1),
    			idx: idx,
				id: Math.random(36).toString(),
    		});
    	});

    	this.setState({lessons: lessons});
    	this.getSummary(lessons);
    }

	render(){
		const paddingVal = (this.checkMobile() ? "60px" : "10px")
		return ( 
			<div className="app-body">
                <main className="main dataview">
                    <Container fluid className='paddingTop20 paddingBottom20 main-width' style={{paddingTop:paddingVal}}>
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

						{ (this.state.lessons.length===0)
						?
							<div>
								<h3>
									No lessons created yet
								</h3>
									{this.props.user.displayName===undefined
									?
										<p>You need to <a href="/create">create a lesson</a> to see analytics here.</p>
									:
										<p>Please  <a href="/account">log in</a> to see your analytics.</p>
									}
							</div>
						:
						<React.Fragment>
							<DataOverview 
								onChangeData={this.onChangeData}
								data={this.state.lessons}
							/>

							<DataDetails 
								contentTitle={this.state.contentTitle} 
								data={this.state.currentDataIdx===-1
									  ? this.summary
									  : this.state.lessons[this.state.currentDataIdx]
							    }
							/>
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
