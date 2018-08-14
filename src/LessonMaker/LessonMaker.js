import React, {Component} from 'react';
import {Container} from "reactstrap"
import uuidv4 from "uuid/v4"

import {moveEntry, withoutEntry, getObjectsByKey} from "../utils/trickBox";
import SideBarLesson from "./SideBarLesson";
import Element from "./Element";
import ElementAdder from './ElementAdder'

import globals from '../globals'
import tools from '../tools'

import posed, {PoseGroup} from 'react-pose';

import {connect} from "redux-zero/react";
import actions from "../store/actions";


const Item = posed.div();

class LessonMaker extends Component {
    // state = {
    //     isEditMode: true,
    // };

    componentDidMount() {
        // this.inhaleSessionStorage();
        //api.getProjectsForUser().then()
        const that = this;
        this.autoSaver = setInterval(function () {
            that.saveStatus()
        }, 20000)
    }

    componentWillUnmount() {
        clearInterval(this.autoSaver);
    }

    //TODO timestamps for restore / reject
    inhaleSessionStorage() {

        // const proj = JSON.parse(JSON.stringify(this.state.project));
        //
        // //deep searches data and returns 1D array with objects that have an ID property
        // //by reference!
        // const allWithID = getObjectsByKey([proj], 'id');
        // const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(globals.SESSIONSTORAGE_KEY))
        // //get
        // sessionKeys.forEach(key => {
        //     const match = allWithID.find(el => globals.SESSIONSTORAGE_KEY + el['id'] === key)
        //     if (match) {
        //         match.content = JSON.parse(sessionStorage.getItem(key)).content;
        //     }
        // })
        // this.setState({project: proj});
    }

    // toggle(prop) { //used for isEditmode...
    //     this.setState({[prop]: !this.state[prop]})
    // }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }


    render() {
        const activeChapter = this.props.chapters[this.props.activeChapterIndex];
        const {elements} = activeChapter;

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
                                    <ElementAdder
                                        key={el.id + 1}
                                        idx={idx}
                                    />
                                </Item>
                            )}
                        </PoseGroup>
                    </Container>
                </main>
            </div>
        )
    }
}

const mapStoreToProps = ({chapters, activeChapterIndex, isEditMode}) => ({isEditMode, chapters, activeChapterIndex})

//neededActions === function
const neededActions = (store) => {
    const {onChangeChapterTitle, onToggleEditMode} = actions();
    return {onChangeChapterTitle, onToggleEditMode}
};

export default connect(mapStoreToProps, neededActions)(LessonMaker);
