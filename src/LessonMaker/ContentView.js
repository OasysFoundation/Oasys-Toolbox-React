import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element/Element';
import ShowChildrenWhenReady from './ShowChildrenWhenReady';
import {ICON, flatten, isEmpty} from '../utils/trickBox'
import {Container} from "reactstrap"
import ConcludingContentPage from '../ConcludingContentPage'
import {isElementEmpty} from "../utils/tools";
import api from '../utils/api'

import {connect} from "redux-zero/react";
import actions from "../store/actions";
import history from "../history";
import globals from "../utils/globals";


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
        this.handleQuizAnswer = this.handleQuizAnswer.bind(this);
        this.isLastChapter = this.isLastChapter.bind(this);
        this.goToCompletionScreen = this.goToCompletionScreen.bind(this);

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
            const chapterIndex = parseInt(this.props.match.params.chapterIndex, 10) || 0;
            console.log(chapterIndex, 'index')

            api.getContent(uid, contentId)
                .then(results => {
                    const project = results[0]
                    //console.log(project);
                    const {contentId, uid: author} = project;

                    that.setState(() => that.produceState(project.data.chapters, chapterIndex))
                })
                .catch(err => console.log('error at contentview fetch ', err))
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeChapterIndex != null && this.props.isPreview) {
            this.setState({
                activeChapterIndex: nextProps.activeChapterIndex,
                activeChapterID: nextProps.chapters[nextProps.activeChapterIndex].id
            })
        }
    }

    produceState(chapterData, chapterIndex = this.props.activeChapterIndex || 0) {
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

    goToCompletionScreen() {
        this.setState({
            showsContentCompletion: true
        });
    }

    goToNextChapter = () => {
        if (this.isLastChapter()) {
            this.goToCompletionScreen()
            return
        }
        const {chapters} = this.state;

        const idx = this.state.activeChapterIndex;
        //is there more chapters?
        const nextIdx = (idx + 1) >= chapters.length ? idx : (idx + 1);
        const nextID = chapters[nextIdx].id;

        // this.chaptersSeenIDs.push(nextID);

        this.setState({
            activeChapterIndex: nextIdx,
            activeChapterID: nextID
        })//(chapters[nextIdx].elements[0].id, {top: '80vh'}));
        //this.props.o
    }

    isLastChapter() {
        return (this.state.activeChapterIndex === this.state.chapters.length - 1);
    }

    goToElementinChapter(nextElementIndex) {
        const nextElementID = this.state.chapters[this.state.activeChapterIndex].elements[nextElementIndex].id
    }

    goToChapter = (sendToChapterID, interactionElementID) => {

        console.log('check', this.isLastChapter())
        if (this.isLastChapter()) {
            this.goToCompletionScreen()
            return
        }

        console.log("ids", sendToChapterID, interactionElementID, this.state.chapters, "ids")
        if (isEmpty(sendToChapterID)) {
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
        const {username, title, uid, contentId} = this.props.match.params;
        history.push(`/view/${username}/${title}/${uid}/${contentId}/${chapterIndex}`)

    }

    showConcludingContentPage() {
        const {uid, username, contentId, title} = this.props.match.params;
        var url = this.removeLastComponentOfUrl(window.location.href);
        return <ConcludingContentPage uid={uid} url={url}
                                      author={username} title={title}
                                      contentId={contentId}
                                      description="Explore Interactive Content – Learn Science and Technology through Experimentation and Play!"/>
    }

    removeLastComponentOfUrl(url) {
        const array = url.split("/");
        array.pop();
        return array.join("/");
    }

    render() {

        const that = this;
        const {allElementsinProject} = this.state;

        if (!allElementsinProject) {
            return <div>...Loading Content</div>
        }


        return (
                <React.Fragment>
                    <div className={this.props.isPreview ? null : "app-body"}>
                        <main className={this.props.isPreview ? null : "main"}>
                            <Container fluid className='main-width'>
                                <React.Fragment>
                                    {this.state.showsContentCompletion  && !this.props.isPreview
                                        ? this.showConcludingContentPage()
                                        :
                                        <div>
                                            {allElementsinProject.map(el => (
                                                el.parentChapterID === that.state.activeChapterID
                                                    && (this.isLastChapter() ? el.type !== globals.EDIT_CONTINUE_ELEMENT : true)

                                                &&
                                                        <div className="item">
                                                            {!isElementEmpty(el)
                                                            &&
                                                            <ShowChildrenWhenReady>
                                                                <Element
                                                                    data={el}
                                                                    id={el.id}
                                                                    isPreview={this.props.isPreview}
                                                                    isEditMode={false}
                                                                    handleChapterChange={this.goToChapter}
                                                                    handleQuizAnswer={this.handleQuizAnswer}
                                                                />
                                                            </ShowChildrenWhenReady>
                                                            }
                                                        </div>
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
                                        {this.isLastChapter() && (
                                            <div onClick={this.goToCompletionScreen.bind(this)}>
                                                {ICON("icon-arrow-down", 40)}
                                            </div>
                                        )}

                                    </div>
                                }

                            </center>
                        </main>
                    </div>
                </React.Fragment>
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
