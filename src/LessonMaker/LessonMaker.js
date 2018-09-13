import React, {Component} from 'react';
import {Container} from "reactstrap"
import SideBarLesson from "./SideBarLesson";
import posed, {PoseGroup} from 'react-pose';
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from "redux-zero/react";

import actions from "../store/actions";
import Element from "./Element/Element";
import ElementAdder from './ElementAdder'
import ContentView from './ContentView'
import colors from '../utils/colors';

//import EndOfChapterElement from './EndOfChapterElement';
//import uuidv4 from 'uuid/v4';
import globals from "../utils/globals";
//import {isEmpty} from "../utils/trickBox";
import EditModalWarning from './EditModalWarning'

import { isMobile } from '../utils/tools'

const Item = posed.div();

class LessonMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteChapterDialog: false,

        };
        this.handleChapterDeleteModal = this.handleChapterDeleteModal.bind(this);
        this.handleChapterDeleteModalClose = this.handleChapterDeleteModalClose.bind(this);
        this.handleChapterDelete = this.handleChapterDelete.bind(this);
        this.renderChapterDeleteModal = this.renderChapterDeleteModal.bind(this);
        this.renderPreviewButton = this.renderPreviewButton.bind(this);
        props.restoreStateFromSession();
    }

    componentDidMount() {
        this.props.updateChapterLinks();
    }

    handleChapterDeleteModal() {
        this.setState({
            showDeleteChapterDialog: true,
        });
    }

    handleChapterDeleteModalClose() {
        this.setState({
            showDeleteChapterDialog: false,
        });
    }

    handleChapterDelete() {
        const {chapters, activeChapterIndex} = this.props;
        this.handleChapterDeleteModalClose();
        const oldIndex = activeChapterIndex;
        let index = activeChapterIndex === chapters.length - 1 ? chapters.length - 2 : activeChapterIndex;
        // const currIdx = activeChapterIndex;
        console.log(this.props.activeChapterIndex, index)

        if (chapters.length === 1) {
            index = 0;
        }

        this.props.onChangeActiveChapter(chapters[index].id)
        this.props.onDeleteChapter(chapters[oldIndex].id);

        console.log(this.props.chapters[this.props.activeChapterIndex])

    }

    renderPreviewButton(){
        return(
             <button
                type="button"
                className={this.props.isEditMode ? "btn btn-dark preview-btn" : "btn btn-light preview-btn"}
                style={{width: '150px'}}
                onClick={() => {
                    this.props.instantUpdateElements(true)
                    setTimeout(() => {
                        this.props.onToggleEditMode()
                    }, 250);

                }}
            >
                <span className={this.props.isEditMode ? "icon-grid" : "icon-layers"}></span>
                {"  "}
                {this.props.isEditMode ? 'Preview' : '  Edit  '}
            </button>
        )
    }

    renderChapterDeleteModal() {
        const modal = (this.props.chapters.length === 1)
            ? (<React.Fragment>
                    <ModalHeader>
                        Cannot delete chapter
                    </ModalHeader>
                    <ModalBody>
                        <p>Sorry, but each lesson needs to have at least one chapter, so you
                            cannot delete this chapter.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleChapterDeleteModalClose}>OK</Button>
                    </ModalFooter>
                </React.Fragment>
            )
            : (<React.Fragment>
                    <ModalHeader>
                        Delete chapter?
                    </ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this chapter?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.handleChapterDeleteModalClose}>Cancel</Button>
                        <Button style={{backgroundColor: '#c6361d', color: colors.SNOW1}}
                                onClick={this.handleChapterDelete}>Delete</Button>
                    </ModalFooter>
                </React.Fragment>
            )
        return modal;
    }

    render() {
        const activeChapter = this.props.chapters[this.props.activeChapterIndex];
        if (!activeChapter) {
            return <div>No chapters found</div>
        }
        const {elements} = activeChapter;
        const emptyChapterAdder = elements.length > 0 ? null : <ElementAdder key={"filler"} idx={0}/>;
        const paddingVal = (isMobile() ? "60px" : "10px")
        const headerSeparation = (isMobile() ? "10px" : "50px")


        if (elements.filter(e => e.type === globals.EDIT_CONTINUE_ELEMENT).length > 1) {
            this.props.onDeleteElement(elements.find(e=> e.type === globals.EDIT_CONTINUE_ELEMENT ).id)
        }

        return (
            <div className="app-body" style={{paddingTop: paddingVal}}>
                <EditModalWarning contentTitle={this.props.title} isOpen={false}/>
                <SideBarLesson sendSnackBarMessage={this.props.sendSnackBarMessage}/>
                <div className="create">
                    <main className="main">
                        <Modal isOpen={this.state.showDeleteChapterDialog} toggle={this.handleChapterDeleteModalClose}
                               backdrop={true}>
                            {this.renderChapterDeleteModal()}
                        </Modal>

                        <Container fluid className='main-width'>
                            <center>
                                <section className='main-width' style={{
                                    display: 'flex',
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                    flex: 1,
                                    flexDirection: 'row'
                                }}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Chapter Title</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control header"
                                        placeholder="Name your Chapter"
                                        aria-label="Name this Chapter"
                                        value={activeChapter.title}
                                        onChange={(ev) => this.props.onChangeChapterTitle(ev.target.value)}
                                        aria-describedby="basic-addon1"
                                        style={{marginRight: '10px'}}
                                    />
                                    <button
                                        type="button"
                                        className="btn preview-btn delete-btn"
                                        style={{marginRight:headerSeparation}}
                                        onClick={this.handleChapterDeleteModal}
                                    >
                                        Delete
                                    </button>
                                    {isMobile()
                                        ? null
                                        :this.renderPreviewButton()
                                    }
                                   
                                </section>
                                {this.props.isEditMode
                                    ? (<React.Fragment>
                                        <PoseGroup>
                                            {elements.map((el, idx) => {
                                                    return (<Item key={el.id}>
                                                        {(elements.length===1) && <ElementAdder key={el.id + 1} idx={idx}/>}

                                                        <Element key={el.id} data={el} isPreview={true}>
                                                        </Element>

                                                        {(idx<elements.length-1) && <ElementAdder key={el.id + 1} idx={idx}/>}
                                                    </Item>)
                                                }
                                            )}
                                        </PoseGroup>

                                        {/*<SelectionDropdown onSelect={this.onSelectAction} identifier={"action-correct"}*/}
                                        {/*default={this.state.childChoice.text}*/}
                                        {/*options={this.choices.map(choice => choice.text)}/>*/}

                                        {/*checks if there are elements first, then inserts ContinueButton at end*/}
                                        {
                                            (elements.length===0 || (elements[elements.length - 1].type !== globals.EDIT_CONTINUE_ELEMENT)
                                                ? this.props.onAddElement(globals.EDIT_CONTINUE_ELEMENT, elements.length)
                                                : null)
                                        }
                                        {/*? <Element */}
                                        {/*data={elements[elements.length - 1]} chapterID={activeChapter.id} />*/}

                                        {/*create the last element if it isn't ...so it's in store as well*/}
                                        {/*: this.props.onAddElement(globals.EDIT_CHAPTEREND, elements.length-1)*/}
                                        {/*: <Element data={{*/}
                                        {/*type: 8,*/}
                                        {/*id: uuidv4(),*/}
                                        {/*content: {action: null},*/}
                                        {/*parentChapterId: activeChapter.id*/}
                                        {/*}}/>*/}
                                        {/*}*/}

                                    </React.Fragment>)


                                    : <ContentView
                                        isPreview={true}
                                        activeChapterIndex={this.props.activeChapterIndex}
                                        chapters={this.props.chapters}
                                        onChangeActiveChapter={this.props.onChangeActiveChapter}/>
                                }

                                {emptyChapterAdder}
                            </center>

                        </Container>
                    </main>
                </div>
            </div>
        )
    }
}

LessonMaker.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.array,
        id: PropTypes.string,
        elements: PropTypes.array
    })).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    activeChapterIndex: PropTypes.number
};

const mapStoreToProps = ({chapters, activeChapterIndex, isEditMode, title}) => ({isEditMode, chapters, activeChapterIndex, title})
const neededActions = (store) => {
    const {onChangeActiveChapter,
        restoreStateFromSession,
        instantUpdateElements, onChangeLastElementChild, onAddElement, updateChapterLinks,
        onDeleteChapter, onDeleteElement, onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage} = actions();
    return {
        onChangeActiveChapter,
        restoreStateFromSession,
        onChangeLastElementChild,
        onAddElement,
        onDeleteElement,
        updateChapterLinks,
        onDeleteChapter,
        instantUpdateElements,
        onChangeChapterTitle,
        onToggleEditMode,
        mergeStoreWithSessionStorage
    }
};

export default connect(mapStoreToProps, neededActions)(LessonMaker);
