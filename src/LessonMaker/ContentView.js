import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import ScrollView, {ScrollElement} from "../utils/scroller";
import {ICON, flatten, isEmpty} from '../utils/trickBox'
import {Container} from "reactstrap"
import ConcludingContentPage from '../ConcludingContentPage'
import {isElementEmpty} from "../utils/tools";
import api from '../utils/api'

import {connect} from "redux-zero/react";
import actions from "../store/actions";

class ContentView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chapters: null,
            allElementsinProject: null,
            //decides what elements are not HIDDEN in the SCROLLVIEW
            showsContentCompletion: false
        }

        this.goToChapter = this.goToChapter.bind(this);
        this.produceState = this.produceState.bind(this);
        this.handleChangeElementVisibility = this.handleChangeElementVisibility.bind(this);
        this.handleQuizAnswer = this.handleQuizAnswer.bind(this);

        this.maxUpdateAttempts = 5;
        this.numScheduledUpdates = 0;
        this.analytics = {
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            quizzes: [],
            //contentId: this.state.content.contentId,

            //let's call this learnerId
            //accessUserId: this.props.user.name,

            //let's call this authorId
            //contentUserId: this.props.content.userId,
        };
    }

    componentDidMount() {
        const that = this;
        if (this.props.isPreview) {
            try {
                this.setState(() => that.produceState(that.props.chapters))
            }
            catch (error) {
                console.log(error, ' error at props chapter @ Contentview')
            }
        }

        else {
            const {username, title} = this.props.match.params;
            const chapterIndex = this.props.match.params.chapterIndex || 0;
            console.log(chapterIndex, 'index')

            api.getContentByUserNameAndTitle(username, title)
                .then(results => {
                    const project = results[0]
                    console.log(project);
                    const {contentId, uid: author} = project;
                    that.analytics.contentId = contentId;
                    that.analytics.contentUserId = author;
                    if (that.props.user.uid) {
                        that.analytics.accessUserId = that.props.user.uid;
                    }
                    //else wait for componentWillReceiveProps
                    console.log(that.analytics, "analytics @ mount")

                    that.setState(() => that.produceState(project.data.chapters, chapterIndex))
                })
                .catch(err => console.log('error at contentview fetch ', err))
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('props @ ', Date.now(), nextProps.user);

        //firebase auth takes longer if loading the link directly per URL
        this.analytics.accessUserId = nextProps.user.uid;
        console.log(this.analytics, "analytics")
    }

    produceState(chapterData, chapterIndex = 0) {
        console.log(chapterData, 'chapterData')
        const chapters = JSON.parse(JSON.stringify(chapterData))
        const allElements = flatten(chapters.map(chapter => chapter.elements));
        return {
            chapters: chapters,
            allElementsinProject: allElements,
            activeChapterID: chapters[chapterIndex].id,
            activeChapterIndex: chapterIndex
        }
    }

    scrollTo = (name) => {
        this._scroller.scrollTo(name);
    }

    goToCompletionScreen() {
        this.setState({
            showsContentCompletion: true
        });
    }

    goToNextChapter = () => {
        const {chapters} = this.state;

        const idx = this.state.activeChapterIndex;
        //is there more chapters?
        const nextIdx = (idx + 1) >= chapters.length ? idx : (idx + 1);
        const nextID = chapters[nextIdx].id;

        // this.chaptersSeenIDs.push(nextID);

        this.setState({
            activeChapterIndex: nextIdx,
            activeChapterID: nextID
        }, () => this.scrollTo(chapters[nextIdx].elements[0].id, {bottom: '5vh'}));
        //this.props.o
    }

    isLastChapter() {
        return (this.state.activeChapterIndex == this.state.chapters.length - 1);
    }

    goToElementinChapter(nextElementIndex) {
        const nextElementID = this.state.chapters[this.state.activeChapterIndex].elements[nextElementIndex].id
        this.scrollTo(nextElementID)

    }

    goToChapter = (sendToChapterID, interactionElementID) => {
        console.log("ids", sendToChapterID, interactionElementID, "ids")
        if (isEmpty(sendToChapterID)) {
            //scroll to next element or (if end of chapter, next elements chapter)
            const currentChapter = this.state.chapters[this.state.activeChapterIndex]
            const interactionElementIndex = currentChapter.elements.findIndex(el => el.id === interactionElementID);
            const isLastElement = currentChapter.elements.length - 1 <= interactionElementIndex

            console.log("Last element ? ", isLastElement)
            isLastElement ? this.goToNextChapter() : this.goToElementinChapter(interactionElementIndex);
            return
        }
        // this.chaptersSeenIDs.push(sendToChapterID);
        const chapterIndex = this.state.chapters.findIndex(chapter => chapter.id === sendToChapterID);
        this.setState({
            activeChapterIndex: chapterIndex,
            activeChapterID: sendToChapterID
        }, () => {
            this.scrollTo(this.state.chapters[chapterIndex].elements[0].id);

            //highlight the active chapter in TOC while previewing
            //TODO not really working here...
            this.props.onChangeActiveChapter(sendToChapterID)
        });

    }

    postAnalytics = async function(n) {
        try {
            let response = await api.postUserContentAccess(this.analytics);
            this.numScheduledUpdates -= 1;
            return response;
        } catch(err) {
            if (n === 1) {
                console.log(err);
            }
            if (this.numScheduledUpdates > 1) {
                this.numScheduledUpdates -= 1;
                return;
            } else {
                return await setTimeout(()=>this.postAnalytics(n-1), 5000);
            }
        }
    }

    handleQuizAnswer(obj) {
        this.analytics.quizzes.push(obj);
        console.log('handleQuizAnswer: ' + JSON.stringify(this.analytics));
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    handleChangeElementVisibility(obj) {
        this.analytics.accessTimes.push(obj);
        console.log('handleChangeElementVisibility: ' + JSON.stringify(this.analytics));
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    render() {

        const that = this;
        const {allElementsinProject} = this.state;

        if (!allElementsinProject) {
            return <div>...Loading Content</div>
        }

        return (
            <ScrollView ref={scroller => this._scroller = scroller}>
                <div className={this.props.isPreview ? null : "app-body"}>
                    <main className={this.props.isPreview ? null : "main"}>
                        <Container fluid className='main-width'>
                            <React.Fragment>
                                {this.state.showsContentCompletion ?
                                    <ConcludingContentPage url="https://joinoasys.org"
                                                           author="Mark22" title="Feet and Cotion"
                                                           description="I am explaining to you how feet and cotion works."/>
                                    :
                                    <div>
                                        {allElementsinProject.map(el => (
                                            (el.parentChapterID === that.state.activeChapterID)
                                                ?
                                                <ScrollElement key={el.id} name={el.id}>
                                                    <div className="item">
                                                        {!isElementEmpty(el)
                                                        &&
                                                        <Element
                                                            data={el}
                                                            id={el.id}
                                                            isPreview={this.props.isPreview}
                                                            isEditMode={false}
                                                            onLearnerInteraction={this.goToChapter}
                                                            onChangeVisibility={this.handleChangeElementVisibility}
                                                            onQuizAnswer={this.handleQuizAnswer}
                                                        />
                                                        }
                                                    </div>
                                                </ScrollElement>
                                                : null
                                        ))
                                        }
                                    </div>
                                }

                            </React.Fragment>
                        </Container>
                        <center>
                            {this.state.showsContentCompletion ?
                                null
                                :
                                <div className='pointer'>
                                    {this.isLastChapter() ? (
                                        <div onClick={this.goToCompletionScreen.bind(this)}>
                                            {ICON("icon-arrow-down", 40)}
                                        </div>
                                    ) : (
                                        <div onClick={() => this.goToNextChapter()}>
                                            {ICON("icon-arrow-down", 40)}
                                        </div>
                                    )}

                                </div>
                            }
                        </center>
                    </main>
                </div>
            </ScrollView>
        );
    }
}

ContentView.defaultProps = {
    isPreview: false,
}

ContentView.propTypes = {
    chapters: PropTypes.array.isRequired,
    onChangeActiveChapter: PropTypes.func.isRequired,
    isPreview: PropTypes.bool.isRequired

}

const mapStoreToProps = ({chapters, user}) => ({chapters, user})
const neededActions = (store) => {
    const {onChangeActiveChapter} = actions();
    return {onChangeActiveChapter}
};

export default connect(mapStoreToProps, neededActions)(ContentView);
