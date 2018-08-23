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

        this.analytics = {
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            quizzes: [],
            //contentId: this.state.content.contentId,
            //accessUserId: this.props.user.name,
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
                .then(project => {
                    console.log(project)
                    that.setState(() => that.produceState(project[0].data.chapters, chapterIndex))
                })
                .catch(err => console.log('error at contentview fetch ', err))
        }
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

    updateTiming() {
        const t1 = this.analytics.lastTime;
        const t2 = new Date();
        var newelement = {i: this.state.slideIdx, t: t2 - t1};
        var newArr = [...this.state.timing, newelement]

        this.setState({
            timing: newArr
        })

        let tobj = {
            startTime: this.state.startTime,
            timing: newArr,
            lastTime: t2
        }
        this.setState({
            lastTime: t2
        })
        return tobj;
    }

    postInteractionData(timeObj) {
        const data = {
            "accessTimes": timeObj.timing,
            "startTime": timeObj.startTime,
            "endTime": timeObj.endTime,
            "contentId": this.state.content.contentId,
            "accessUserId": this.props.authUser.displayName,
            "contentUserId": this.state.content.userId
        }
        //API.postUserContentAccess(data);
    }

    postQuizData(quizObj) {
        console.log(this.props.authUser.displayName);
        const data = {
            "startTime": quizObj.startTime,
            "endTime": quizObj.endTime,
            "contentId": this.state.content.contentId,
            "accessUserId": this.props.authUser.displayName,
            "contentUserId": this.state.content.userId,
            "quizzes": quizObj.quizzes,
            "type": "quizUpdate"
        }
        //API.postUserContentAccess(data);
    }

    handleChangeElementVisibility(elem) {
        this.analytics.accessTimes.push(elem);
        //API.postUserContentAccess(this.analytics);
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
                                <div>
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
    chapters: PropTypes.object.isRequired,
    onChangeActiveChapter: PropTypes.func.isRequired,
    isPreview: PropTypes.bool.isRequired

}

const mapStoreToProps = ({chapters}) => ({chapters})
const neededActions = (store) => {
    const {onChangeActiveChapter} = actions();
    return {onChangeActiveChapter}
};

export default connect(mapStoreToProps, neededActions)(ContentView);
