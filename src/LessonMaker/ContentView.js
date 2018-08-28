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
import withLoader from './withLoader'
import history from "../history";

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
        this.analytics = { // credentials are set in componentDidMount
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            contentId: null,
            quizzes: [],
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
            const {uid, contentId} = this.props.match.params;
            const chapterIndex = this.props.match.params.chapterIndex || 0;
            console.log(chapterIndex, 'index')

            api.getContent(uid, contentId)
                .then(results => {
                    const project = results[0]
                    //console.log(project);
                    const {contentId, uid: author} = project;
                    that.analytics.contentId = contentId;
                    that.analytics.contentUserId = author;
                    if (that.props.user.uid) {
                        that.analytics.accessUserId = that.props.user.uid;
                    }
                    //else wait for componentWillReceiveProps
                    //console.log(that.analytics, "analytics @ mount")

                    console.log(project, "contentview data")

                    that.setState(() => that.produceState(project.data.chapters, chapterIndex))
                })
                .catch(err => console.log('error at contentview fetch ', err))
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('props @ ', Date.now(), nextProps.user);

        //firebase auth takes longer if loading the link directly per URL
        this.analytics.accessUserId = nextProps.user.uid;
        //console.log(this.analytics, "analytics")
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
        this.analytics.endTime = new Date();
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
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
        }, () => this.scrollTo('first'))//(chapters[nextIdx].elements[0].id, {top: '80vh'}));
        //this.props.o
    }

    isLastChapter() {
        return (this.state.activeChapterIndex === this.state.chapters.length - 1);
    }

    goToElementinChapter(nextElementIndex) {
        const nextElementID = this.state.chapters[this.state.activeChapterIndex].elements[nextElementIndex].id
        this.scrollTo(nextElementID)

    }

    goToChapter = (sendToChapterID, interactionElementID) => {
        console.log("ids", sendToChapterID, interactionElementID, this.state.chapters, "ids")
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


            //yet another edge case whaahahaa
            if (this.props.match) {
                this.changePagination(chapterIndex)
            }

            // this.props.match.params.chapterIndex = chapterIndex.toString();
            //highlight the active chapter in TOC while previewing
            //TODO not really working here...
            this.props.onChangeActiveChapter(sendToChapterID)
        });

    }

    changePagination = (chapterIndex) => {
        const {username, title, uid, contentId} = this.props.match.path;
        history.push(`/view/${username}/${title}/${uid}/${contentId}/${chapterIndex}`)

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

    handleQuizAnswer(obj) {
        this.analytics.quizzes.push(obj);
        //console.log('handleQuizAnswer: ' + JSON.stringify(this.analytics));
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    handleChangeElementVisibility(obj) {
        this.analytics.accessTimes.push(obj);
        //console.log('handleChangeElementVisibility: ' + JSON.stringify(this.analytics));
        this.numScheduledUpdates += 1;
        this.postAnalytics(this.maxUpdateAttempts);
    }

    showConcludingContentPage() {
        const {uid, username, contentId, title} = this.props.match.params;
        return <ConcludingContentPage uid={uid} url="https://joinoasys.org"
                                      author={username} title={title}
                                      contentId={contentId}
                                      description="I am explaining to you how feet and cotion works."/>
    }

    render() {

        const that = this;
        const {allElementsinProject} = this.state;

        if (!allElementsinProject) {
            return <div>...Loading Content</div>
        }


        return (
            <ScrollView ref={scroller => this._scroller = scroller}>
                <React.Fragment>
                    {/*This extra ScrollElement on the top fixes the scrolling problem*/}
                    <ScrollElement name={'first'}>
                        <div></div>
                    </ScrollElement>
                    <div className={this.props.isPreview ? null : "app-body"}>
                        <main className={this.props.isPreview ? null : "main"}>
                            <Container fluid className='main-width'>
                                <React.Fragment>
                                    {this.state.showsContentCompletion  && !this.props.isPreview?
                                        this.showConcludingContentPage()
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
                                {/*THIS IS NOW DONE in else*/}
                                {this.state.showsContentCompletion ?
                                    null
                                    :
                                    <div className='pointer'>
                                        {this.isLastChapter() ? (
                                            <div onClick={this.goToCompletionScreen.bind(this)}>
                                                {ICON("icon-arrow-down", 40)}
                                            </div>
                                        ) : null


                                            //     (
                                            //     <div onClick={() => this.goToNextChapter()}>
                                            //         {ICON("icon-arrow-down", 40)}
                                            //     </div>
                                            // )
                                        }

                                    </div>
                                }

                            </center>
                        </main>
                    </div>
                </React.Fragment>
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
