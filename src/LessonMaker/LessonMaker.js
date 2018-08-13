import React, {Component} from 'react';
import {Container} from "reactstrap"
import uuidv4 from "uuid/v4"

import {moveEntry, withoutEntry, getObjectsByKey} from "../utils/trickBox";
import SideBarLesson from "./SideBarLesson";
import Element from "./Element";
import ElementAdder from './ElementAdder'

import globals from '../globals'

import posed, {PoseGroup} from 'react-pose';

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
                                start: 0.0,
                                stop: 100.0,
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
    constructor() {
        super();

        //@operations
        //Element-wise --> ElementWEdit
        this.onDeleteElement = this.onDeleteElement.bind(this);
        this.onMoveElement = this.onMoveElement.bind(this);

        //Chapter-wise --> Sidebar
        this.setActiveChapter = this.setActiveChapter.bind(this);
        this.onAddChapter = this.onAddChapter.bind(this);
        this.onAddElement = this.onAddElement.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);

        this.autoSaveTimer = 15000; //post state to backend every 15 seconds
    }

    state = {
        project: MockData.projects[0],
        currChapIdx: 0,
        isEditMode: true,
    };

    setActiveChapter(id) {
        const idx = this.state.project.chapters.findIndex(chap => chap.id === id)
        this.setState({currChapIdx: idx})

        this.inhaleSessionStorage();
    }

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

    reverseAction() { //go back in state versions

    }

    onDeleteElement(id) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let elements = proj.chapters[this.state.currChapIdx].elements;
        const entryIdx = elements.findIndex(el => el.id === id.toString());


        proj.chapters[this.state.currChapIdx].elements = withoutEntry(elements, entryIdx);

        this.setState({project: proj})
    }

    onAddElement(typeSelected, atIdx) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let elements = proj.chapters[this.state.currChapIdx].elements;
        const newElem = {
            id: uuidv4(),
            type: typeSelected,
            content: "",
            timestamp: Date.now()
        };

        proj.chapters[this.state.currChapIdx].elements = [
            ...elements.slice(0, atIdx + 1),
            newElem,
            ...elements.slice(atIdx + 1)
        ];
        console.log("ELEME", proj.chapters[this.state.currChapIdx].elements)
        this.setState({project: proj})
    }

    onChangeContent(id, value) {
         const proj = JSON.parse(JSON.stringify(this.state.project));
         let elements = proj.chapters[this.state.currChapIdx].elements;
    
         const elem = elements.find(el => el.id === id);
         elem.content = value;
         elem.timestamp = Date.now();
    
         proj.chapters[this.state.currChapIdx].elements = elements;
    
         this.setState({project: proj})
     }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }

    onMoveElement(id, direction) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let elements = proj.chapters[this.state.currChapIdx].elements;
        const entryIdx = elements.findIndex(el => el.id === id);

        proj.chapters[this.state.currChapIdx].elements = moveEntry(elements, entryIdx, direction)

        this.setState({project: proj})
    }

    onChangeChapterTitle(value) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let chap = proj.chapters[this.state.currChapIdx];
        chap.title = value;
        this.setState({project: proj})
    }

    onAddChapter() {
        const proj = JSON.parse(JSON.stringify(this.state.project));

        proj.chapters.push(
            {
                id: Math.random().toFixed(36),
                title: this.state.project.title || `<<< Chapter Title XYZ >>>`,
                elements: [],
                timestamp: Date.now()
            }
        );

        this.setState({project: proj})
    }

    handleInteractionEvent(eventId) {
        //eventId => chapterId => setState(activeChapter)
    }

    render() {
        const activeChapter = this.state.project.chapters[this.state.currChapIdx];
        const {elements} = activeChapter;

        return (
            <div className="app-body">
                <SideBarLesson onChapterChange={this.setActiveChapter}
                               onAddChapter={this.onAddChapter}
                               onAddElement={this.onAddElement}
                               chapters={this.state.project.chapters.map(c => ({title:c.title, id: c.id, links: c.links}) )}
                               currChapIdx={this.state.currChapIdx}
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
                                    value={this.state.project.chapters[this.state.currChapIdx].title}
                                    onChange={(ev) => this.onChangeChapterTitle(ev.target.value)}
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
                                        onDelete={this.onDeleteElement}
                                        onMove={this.onMoveElement}
                                        chaptersLight={this.state.project.chapters.map(c => ({title:c.title, id: c.id}) )}
                                        onChange={this.onChangeContent}
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

export default LessonMaker;