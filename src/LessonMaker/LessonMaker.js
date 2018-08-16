import React, {Component} from 'react';
import {Container} from "reactstrap"
import SideBarLesson from "./SideBarLesson";
import posed, {PoseGroup} from 'react-pose';
import PropTypes from 'prop-types';

import {connect} from "redux-zero/react";
import actions from "../store/actions";

import Element from "./Element";
import ElementAdder from './ElementAdder'


const Item = posed.div();

class LessonMaker extends Component {
    constructor(props) {
        super(props);
        // props.mergeStoreWithSessionStorage();
    }

    componentDidMount() {
        // this.inhaleSessionStorage();
        //api.getProjectsForUser().then()
        const that = this;
        this.autoSaver = setInterval(function () {
            that.saveStatus()
        }, 20000);

    }

    componentWillUnmount() {
        clearInterval(this.autoSaver);
    }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }


    render() {
        const activeChapter = this.props.chapters[this.props.activeChapterIndex];
        const {elements} = activeChapter;
        const emptyChapterAdder = elements.length > 0 ? null : <ElementAdder key={"filler"} idx={0}/>;

        return (
            <div className="app-body">


                <SideBarLesson/>
                <main className="main">
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
                                    className={this.props.isEditMode ? "btn btn-dark preview-btn" : "btn btn-light preview-btn"}
                                    style={{width: '150px'}}
                                    onClick={() => this.props.onToggleEditMode()}
                                >
                                    <span className={this.props.isEditMode ? "icon-grid" : "icon-layers"}></span>
                                    {"  "}
                                    {this.props.isEditMode ? 'Preview' : '  Edit  '}
                                </button>
                            </section>
                        </center>
                        <PoseGroup>
                            {elements.map((el, idx) =>
                                <Item key={el.id}>
                                    <Element
                                        key={el.id}
                                        data={el}
                                    />

                                    {/*SHORT FORM FOR --> isEditMode ? <Adder/> : null */}
                                    {this.props.isEditMode && <ElementAdder key={el.id + 1} idx={idx}/>}
                                </Item>
                            )}
                        </PoseGroup>
                        {emptyChapterAdder}
                    </Container>
                </main>
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

const mapStoreToProps = ({chapters, activeChapterIndex, isEditMode}) => ({isEditMode, chapters, activeChapterIndex})
const neededActions = (store) => {
    const {onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage} = actions();
    return {onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage }
};

export default connect(mapStoreToProps, neededActions)(LessonMaker);
