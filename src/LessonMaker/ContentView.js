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

        // console.log(this.props.match.params.contentId, "contentId");
        //
        // // let project;
        // // api.getContentById(this.props.match.params.contentId)
        // //     .then(content => {
        // //         console.log(content, 'content fetched')
        // //     })
        // //     .catch(err => console.log('error at getcontentbyid', err))



        this.chapters = JSON.parse(JSON.stringify(this.props.chapters));
        //inject fromChapter prop to all elements;
        this.chapters
            .forEach(chapter => chapter.elements
            //yes, I am mutating the element object, but it's not by reference!
                .forEach(el => el.fromChapter = chapter.id));

        //make an array with all the elements flat ==> so they can be scrolled scrollable
        this.allElementsinProject = flatten(this.chapters.map(chapter => chapter.elements));

        this.state = {
            //decides what elements are not HIDDEN in the SCROLLVIEW
            activeChapterID: this.chapters[0].id,
            activeChapterIndex: 0,
            showsContentCompletion: false
        }
        // this.chaptersSeenIDs = [this.state.activeChapterID];

        this.goToChapter = this.goToChapter.bind(this);
        this.foldElement = this.foldElement.bind(this);
        this.handleChangeElementVisibility = this.handleChangeElementVisibility.bind(this);

        this.analytics = {
            accessTimes: [],
            startTime: new Date(),
            endTime: null,
            quizzes: [],
            contentId: this.state.content.contentId,
            accessUserId: this.props.user.name,
            contentUserId: this.props.content.userId,
        };
    }

    foldElement(elemID) {
        //set prop shouldFold
        //set prop foldedTextonButton
        //checks in render an replaces with
    }

    unFoldElement(elemID) {

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
        const idx = this.state.activeChapterIndex;
        //is there more chapters?
        const nextIdx = (idx + 1) >= this.chapters.length ? idx : (idx + 1);
        const nextID = this.chapters[nextIdx].id;

        // this.chaptersSeenIDs.push(nextID);

        this.setState({
            activeChapterIndex: nextIdx,
            activeChapterID: nextID
        }, () => this.scrollTo(this.chapters[nextIdx].elements[0].id, {bottom: '5vh'}));
        //this.props.o
    }

    isLastChapter() {
        return (this.state.activeChapterIndex == this.chapters.length-1);
    }

    goToElementinChapter(nextElementIndex) {
        const nextElementID = this.chapters[this.state.activeChapterIndex].elements[nextElementIndex].id
        this.scrollTo(nextElementID)

    }

    goToChapter = (sendToChapterID, interactionElementID) => {
        console.log("ids", sendToChapterID, interactionElementID, "ids")
        if (isEmpty(sendToChapterID)) {
            //scroll to next element or (if end of chapter, next elements chapter)
            const currentChapter = this.chapters[this.state.activeChapterIndex]
            const interactionElementIndex = currentChapter.elements.findIndex(el => el.id === interactionElementID);
            const isLastElement = currentChapter.elements.length - 1 <= interactionElementIndex

            console.log("Last element ? ", isLastElement)
            isLastElement ? this.goToNextChapter() : this.goToElementinChapter(interactionElementIndex);
            return
        }
        // this.chaptersSeenIDs.push(sendToChapterID);
        const chapterIndex = this.chapters.findIndex(chapter => chapter.id === sendToChapterID);
        this.setState({
            activeChapterIndex: chapterIndex,
            activeChapterID: sendToChapterID
        }, () => {
            this.scrollTo(this.chapters[chapterIndex].elements[0].id);

            //highlight the active chapter in TOC while previewing
            //TODO not really working here...
            this.props.onChangeActiveChapter(sendToChapterID)
        });

    }

    postQuizData(quizObj) {
        console.log(this.props.authUser.displayName);
        const data = {
            "startTime": quizObj.startTime,
            "endTime": quizObj.endTime,
            "contentId": this.state.content.contentId,
            "accessUserId": this.props.authUser.displayName,
            "contentUserId": this.state.content.userId,
            "quizzes" : quizObj.quizzes,
            "type" : "quizUpdate"
        }
        //API.postUserContentAccess(data);
    }

    handleChangeElementVisibility(elem) {
        this.analytics.accessTimes.push(elem);
        //API.postUserContentAccess(this.analytics);
    }

    render() {
        const {allElementsinProject} = this;
        console.log(this.props.isPreview)
        return (
            <ScrollView ref={scroller => this._scroller = scroller}>
                <div className={this.props.isPreview ? null : "app-body"}>
                    <main className={this.props.isPreview ? null : "main"}>
                        <Container fluid className='main-width'>
                            <React.Fragment>
                                {this.state.showsContentCompletion? 
                                    <ConcludingContentPage url="https://joinoasys.org"
                                                       author="Mark22" title="Feet and Cotion"
                                                       description="I am explaining to you how feet and cotion works." />
                                    :
                                    <div>
                                    {allElementsinProject.map(el => (
                                        (el.fromChapter === this.state.activeChapterID)
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
                        {this.state.showsContentCompletion? 
                            null
                            :
                            <div>
                            {this.isLastChapter()? (
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
