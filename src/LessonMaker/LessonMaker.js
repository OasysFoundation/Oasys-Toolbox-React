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

import { connect } from "redux-zero/react";
import actions from "../store/actions";
import mapStoreToProps from '../store/mapStoreToProps'


//TODO put in Globals

const MockData = {
    projects: [
        {
            title: "Physics101",
            id: 'project_1245',
            chapters: [
                {
                    title: "Heat and Motion",
                    id: "chapter_124552",
                    links: [
                        {
                            eventId: "ASDASDAS",
                            chapterId: "chapter_99852"
                        },
                    ],
                    // linkIdx: ["chapter_99852"],
                    elements: [

                        {
                            id: "schnuckeldi",
                            type: globals.EDIT_VIDEO,
                            content: {
                                url: 'https://www.youtube.com/watch?v=gcS04BI2sbk',
                                cropStart: 0.0,
                                cropEnd: 0.0,
                            }
                        },
                        {
                            id: "d6363cb1-a398-4637-8528-5b28bf88c5a2",
                            type: globals.EDIT_QUILL,
                            content: "oisdhkashdkajsdhasjkdaksdhaskdaskdhaskdhasldlkashdalskdhalskdhasldhasdkhaskldhasldhaskldASDSASADSaSSD"
                        },
                        {
                            id: "aaaaaa2222222",
                            type: globals.EDIT_QUIZ,
                            content: {
                                question: {
                                    "title": "how you do i asked???",
                                    "image": ""
                                },
                                quizType: "single-choice",
                                answers: [
                                    {
                                        "title": "1 dudeldi dumm da da",
                                        "image": "",
                                        "correct": false,
                                        "feedback": "wrong, sorry try again",
                                        "action": null,
                                        "isSelected": false
                                    },
                                    {
                                        "title": "2 ladi do dari",
                                        "image": "",
                                        "correct": false,
                                        "feedback": "wrong, sorry try again",
                                        "action": null,
                                        "isSelected": false
                                    },
                                    {
                                        "title": "3 schub di dubidu",
                                        "image": "",
                                        "correct": false,
                                        "feedback": "wrong, sorry try again",
                                        "action": null,
                                        "isSelected": false
                                    },
                                    {
                                        "title": "4 nudelholz – Dies ist die Geschichte von Albrecht, dem kleinen Gecko.",
                                        "image": "",
                                        "correct": false,
                                        "feedback": "wrong, sorry try again",
                                        "action": null,
                                        "isSelected": false
                                    }
                                ]
                            }
                        },
                        {
                            id: "aaaaaa222",
                            type: 6,
                            content: "2*2=5"
                        },
                        {
                            id: "asdwasd2",
                            type: 5,
                            content: "https://media0.giphy.com/media/l0NwFIAW8xo5VmDQc/giphy.gif"
                        },
                    ]

                },
                {
                    title: "Feet and Cotion",
                    id: "chapter_99852",
                    elements: [
                        {
                            id: 0,
                            type: "text",
                            content: "YOLO DOLO JOIHSADIOHOAISDHO SAIOHDOIAHSDOI ASHDOIAHD  BAAEMM JAYJAY WOOOHIIII"
                        }
                    ],
                    links: []
                }
            ]
        }
    ]
}


const Item = posed.div();

class LessonMaker extends Component {
    state = {
        project: MockData.projects[0],
        currChapIdx: 0,
        isEditMode: true,
    };

    componentDidMount() {
        this.inhaleSessionStorage();
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

        const proj = JSON.parse(JSON.stringify(this.state.project));

        //deep searches data and returns 1D array with objects that have an ID property
        //by reference!
        const allWithID = getObjectsByKey([proj], 'id');
        const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(globals.SESSIONSTORAGE_KEY))
        //get
        sessionKeys.forEach(key => {
            const match = allWithID.find(el => globals.SESSIONSTORAGE_KEY + el['id'] === key)
            if (match) {
                match.content = JSON.parse(sessionStorage.getItem(key)).content;
            }
        })
        this.setState({project: proj});
    }

    toggle(prop) { //used for isEditmode...
        this.setState({[prop]: !this.state[prop]})
    }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }


    render() {
        const activeChapter = this.props.project.chapters[this.props.project.activeChapterIndex];
        const {elements} = activeChapter;

        return (
            <div className="app-body">
                <SideBarLesson onChapterChange={this.props.onChangeActiveChapter}
                               onAddChapter={this.props.onAddChapter}
                               onAddElement={this.props.onAddElement}
                               onTitleChange={this.props.onChangeChapterTitle}
                               chapters={this.props.project.chapters.map(c => ({title:c.title, id: c.id, links: c.links}) )}
                               currChapIdx={this.props.activeChapterIndex}
                               title={this.props.project.title}
                               {...this.props} //router fucking needs it for CoreUI React ?>?!?!?>!
                />
                <main className="main">
                    <Container fluid>
                        <center>
                            <section className='mainWidth' style={{display: 'flex', marginTop: '1rem', marginBottom: '1rem', flex: 1, flexDirection: 'row'}}>
                                {/*<div style={{marginBottom: 0}} className="input-group mb-3">*/}
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
                                    className={this.state.isEditMode ? "btn btn-dark preview-btn" : "btn btn-light preview-btn"}
                                    style={{width: '150px'}}
                                    onClick={() => this.toggle('isEditMode')}
                                >
                                    <span className={this.state.isEditMode ? "icon-grid" : "icon-layers"}></span>
                                    {"  "}
                                    {this.state.isEditMode ? 'Preview' : '  Edit  '}
                                </button>
                            </section>
                        </center>
                        <PoseGroup>
                            {elements.map((el, idx) =>
                                <Item key={el.id}>
                                <Element
                                        key={el.id}
                                        isPreview={!this.state.isEditMode}
                                        data={el}
                                        chaptersLight={this.state.project.chapters.map(c => ({title:c.title, id: c.id}) )}
                                    />
                                    <ElementAdder
                                        key={el.id + 1}
                                        onAddElement={this.onAddElement}
                                        idx={idx}
                                        nElems={this.state.project.chapters[this.state.currChapIdx].elements.length} />
                                </Item>
                            )}
                        </PoseGroup>
                    </Container>
                </main>
            </div>
        )
    }
}

// const mapToProps = function(store) {
//     console.log(store, "maptoPropsInput")
//     // console.log({currentPerson, people}, "return of map to props")
//
//     console.log(Object.entries(store), 'entries')
//     return { test: store.title}
// };


//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there

// export default connect(mapToProps, actions)( ({projects}) => React.createElement(LessonMaker, {project: projects[0]}) );
export default connect(mapStoreToProps, actions)(LessonMaker);
// export default connect(mapToProps, actions)((propsFromStore) => {
//     console.log(propsFromStore);
//         const {projects} = propsFromStore;
//         return React.createElement(LessonMaker, {project: projects[0]});
//         // return (<LessonMaker people={people} setFirstName={setFirstName}/>)
//     });