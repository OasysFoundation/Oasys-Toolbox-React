import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import ScrollView, {ScrollElement} from "../utils/scroller";
import {ICON, flatten, isEmpty} from '../utils/trickBox'
import {Container} from "reactstrap"
import ConcludingContentPage from '../ConcludingContentPage'
import {isElementEmpty} from "../utils/tools";
import api from '../utils/api'

class ContentView extends Component {
    constructor(props) {
        super(props)

        console.log(this.props.match.params.contentId, "contentId");

        let project;
        api.getContentById(this.props.match.params.contentId)
            .then(content => {
                console.log(content, 'content fetched')
            })
            .catch(err => console.log('error at getcontentbyid', err))



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
            timing: [],
            lastTime: new Date(),
            startTime: new Date(),
            endTime: null,
            quizzes: [],
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
            console.log('NULL ? quiz didnt give chapterID -> default next chapter');
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
            lastTime:t2
        })
        return tobj
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
            "quizzes" : quizObj.quizzes,
            "type" : "quizUpdate"
        }
        //API.postUserContentAccess(data);
    }

    handleNext() {
        let idx = this.state.slideIdx + 1;
        let tobj = this.updateTiming();
        this.setState({slideIdx: idx});
        let endTime = null;
        if (idx === this.state.content.data.length - 1) {
            endTime = new Date();
            tobj.endTime = endTime;
            this.setState(tobj);
        } else {
            tobj.endTime = this.state.endTime;
        }
        this.postInteractionData(tobj);
    }

    handlePrevious() {
        let tobj = this.updateTiming();
        tobj.endTime = this.state.endTime;
        this.setState({
            slideIdx: this.state.slideIdx - 1,
        });
        this.postInteractionData(tobj);
    }

    handleChangeElementVisibility(elem) {
        console.log(elem);
    }

    render() {
        const {allElementsinProject} = this;
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
                                        <ScrollElement key={el.id} name={el.id}>
                                            <div className="item" hidden={el.fromChapter !== this.state.activeChapterID}>
                                                {!isElementEmpty(el)
                                                &&
                                                <Element 
                                                    data={el} 
                                                    id={el.id}
                                                    isEditMode={false}
                                                    onLearnerInteraction={this.goToChapter}
                                                    onChangeVisibility={this.handleChangeElementVisibility}
                                                />
                                                }
                                            </div>
                                        </ScrollElement>))
                                    }
                                    </div>    
                                }
                                

                            </React.Fragment>
                        </Container>
                        <center>
                            {this.isLastChapter()? (
                                <div onClick={this.goToCompletionScreen.bind(this)}>
                                    FINISH EXPERIENCE
                                </div>
                                ) : (
                                <div onClick={() => this.goToNextChapter()}>
                                    {ICON("icon-arrow-down", 40)}
                                </div>
                            )}
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


export default ContentView;
