import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

class UsageTracker extends React.Component {

    constructor(props) {
        super(props);

        this.maxUpdateAttempts = 5;
        this.numScheduledUpdates = 0;
        this.analytics = { // credentials are set in componentDidMount
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            contentId: null,
            quizzes: [],
            accessUserId: null, // TODO: how to get this?!
            contentId: null, // TODO: how to get this?!
            contentUserId: null, // TODO: how to get this?!
        };

        this.handleChangeVisibility = this.handleChangeVisibility.bind(this); // analytics. need to refactor.
    }

    handleChangeVisibility(isVisible) { 
        let elemAnalytics = {
            id: this.props.data.id, 
            type: this.props.data.type, 
            visible: isVisible,
            time: new Date(),
        }
        console.log(elemAnalytics)
        this.analytics.accessTimes.push(elemAnalytics);
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    isLastChapter() {
        return (this.state.activeChapterIndex === this.state.chapters.length - 1);
    }

	componentWillReceiveProps(nextProps) {
        this.analytics.accessUserId = nextProps.user.uid;
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
            }
            if (this.numScheduledUpdates > 1) {
                this.numScheduledUpdates -= 1;
                return;
            } else {
                return await setTimeout(() => this.postAnalytics(n - 1), Math.trunc(30000 / (n - 1)));
            }
        }
    }


	render() {
		return (
            <VisibilitySensor onChange={this.handleChangeVisibility}/>
		)
	}
}

export default UsageTracker;