import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import ScrollView, {ScrollElement} from "../utils/scroller";
import {ICON, flatten, isEmpty} from '../utils/trickBox'
import {Container} from "reactstrap"
import {isElementEmpty} from "../tools";


class ContentView extends Component {
    constructor(props) {
        super(props)


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
            activeChapterIndex: 0
        }
        // this.chaptersSeenIDs = [this.state.activeChapterID];

        this.goToChapter = this.goToChapter.bind(this);
        this.foldElement = this.foldElement.bind(this);
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
        this.props.o
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

    render() {
        console.log('ooooo')
        const {allElementsinProject} = this;
        return (
            <ScrollView ref={scroller => this._scroller = scroller}>
                <div className={this.props.isPreview ? null : "app-body"}>
                    <main className={this.props.isPreview ? null : "main"}>
                        <Container fluid className='main-width'>
                            <React.Fragment>
                                {allElementsinProject.map(el => (

                                    <ScrollElement key={el.id} name={el.id}>
                                        <div className="item" hidden={el.fromChapter !== this.state.activeChapterID}>
                                            {!isElementEmpty(el)
                                            &&
                                            <Element data={el} id={el.id}
                                                     isEditMode={false}
                                                     onLearnerInteraction={this.goToChapter}
                                            />
                                            }
                                        </div>
                                    </ScrollElement>))
                                }
                            </React.Fragment>
                        </Container>
                        <center>
                            <div onClick={() => this.goToNextChapter()}>
                                {ICON("icon-arrow-down", 40)}
                            </div>
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
