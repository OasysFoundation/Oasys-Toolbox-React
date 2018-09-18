import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { connect } from 'redux-zero/react';

import actions from '../../store/actions';
import api from '../../utils/api';

class UsageTracker extends React.Component {

    constructor(props) {
        super(props);

        this.maxUpdateAttempts = 5;
        this.numScheduledUpdates = 0;
        this.analytics = { 
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            quizzes: [],
            accessUserId: null, 
            contentId: this.props.data.contentId,
            contentUserId: this.props.data.authorId, 
        };

        this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
        this.handleQuizAnswer = this.handleQuizAnswer.bind(this);
    }

    handleChangeVisibility(isVisible) { 
        let elemAnalytics = {
            id: this.props.data.id, 
            type: this.props.data.type, 
            visible: isVisible,
            time: new Date(),
        }
        this.analytics.accessTimes.push(elemAnalytics);
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    isLastChapter() {
        return (this.props.activeChapterIndex === this.props.chapters.length - 1);
    }

	componentWillReceiveProps(nextProps) {
        this.analytics.accessUserId = nextProps.user.uid;
        console.log(this.analytics)
	}

    goToCompletionScreen() {
        this.analytics.endTime = new Date();
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    handleQuizAnswer(obj) {
        this.analytics.quizzes.push(obj);
        //console.log('handleQuizAnswer: ' + JSON.stringify(this.analytics));
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    postAnalytics = async function (n) {
        try {
            if (!this.analytics.contentId || !this.analytics.accessUserId) {
                console.error('content ID is not set');
                return;
            }
            let response = await api.postUserContentAccess(this.analytics);
            this.numScheduledUpdates -= 1;
            return response;
        } catch (err) {
            if (n === 1) {
                console.log(err);
                return;
            }
            if (this.numScheduledUpdates > 1) {
                this.numScheduledUpdates -= 1;
                return;
            } else {
                return await setTimeout(() => this.postAnalytics(n - 1), Math.trunc(60000 / (n - 1)));
            }
        }
    }


	render() {
		return (
            <VisibilitySensor onChange={this.handleChangeVisibility}/>
		)
	}
}

const mapStoreToProps = ({chapters, user, activeChapterIndex}) => ({chapters, user, activeChapterIndex})
const neededActions = (store) => {
    const {} = actions();
    return {}
};
export default connect(mapStoreToProps, neededActions)(UsageTracker);