import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import ScrollView, {ScrollElement} from "../utils/scroller";
import {ICON, flatten, isEmpty} from '../utils/trickBox'
import {Container} from "reactstrap"


class ContentView extends Component {
    constructor(props) {
        super(props)

        this.project = JSON.parse(JSON.stringify(this.props.project));
        this.chapters = this.project.chapters;
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
        this.chaptersSeenIDs = [this.state.activeChapterID];

        this.goToChapter = this.goToChapter.bind(this);
    }


    scrollTo = (name) => {
        this._scroller.scrollTo(name);
    }
    goToNextChapter = () => {
        const idx = this.state.activeChapterIndex;
        //is there more chapters?
        const nextIdx =  (idx + 1) >= this.chapters.length ? idx : (idx+1);
        const nextID = this.chapters[nextIdx].id;
        this.chaptersSeenIDs.push(nextID);

        this.setState({
            activeChapterIndex: nextIdx,
            activeChapterID: nextID
        }, () => this.scrollTo(this.chapters[nextIdx].elements[0].id));
    };
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
            const isLastElement = currentChapter.elements.length-1 <= interactionElementIndex

            console.log("Last element ? ", isLastElement)
            isLastElement ? this.goToNextChapter() : this.goToElementinChapter(interactionElementIndex);
            return
        }
        this.chaptersSeenIDs.push(sendToChapterID);
        const chapterIndex = this.chapters.findIndex(chapter => chapter.id === sendToChapterID);
        this.setState({
            activeChapterIndex: chapterIndex,
            activeChapterID: sendToChapterID
        }, () => this.scrollTo(this.chapters[chapterIndex].elements[0].id));

    }

    render() {
        console.log('ooooo')
        const {allElementsinProject} = this;
        return (
            <div className="app-body">
                <main className="main">
                    <Container fluid className='main-width'>
                        {
                            allElementsinProject.map(({id}) => <button className="yoloBut"
                                                                       onClick={() => this.scrollTo(id)}>{id}</button>)
                        }
                        <ScrollView ref={scroller => this._scroller = scroller}>
                            {/*<div className="scroller">*/}
                            <React.Fragment>
                                {allElementsinProject.map(el => (

                                    <ScrollElement key={el.id} name={el.id}>
                                        <div className="item" hidden={ !( this.chaptersSeenIDs.includes(el.fromChapter) )}>
                                            <Element data={el} id={el.id}
                                                     isEditMode={false}
                                                     onLearnerInteraction={this.goToChapter}
                                            />
                                            {el.id}
                                        </div>
                                    </ScrollElement>))
                                }
                            </React.Fragment>
                            {/*</div>*/}
                        </ScrollView>
                        <div onClick={() => this.goToNextChapter()}>
                            {ICON("icon-arrow-down make-big")}
                        </div>
                    </Container>
                </main>
            </div>
        );
    }
}

ContentView.propTypes = {
    elements: PropTypes.array.isRequired
};

export default ContentView;
