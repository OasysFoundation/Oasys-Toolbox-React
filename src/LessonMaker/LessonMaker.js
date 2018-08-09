import React, {Component} from 'react';
import SideBarLesson from "./SideBarLesson";
import Element from "./Element";
import {moveEntry, withoutEntry, getObjectsByKey} from "../utils/trickBox";

import {Container} from "reactstrap"

//TODO put in Globals
const oasysSessionKey = `__OASYS_ID__`;

const MockData = {
    projects: [
        {
            title: "Physics101",
            id: 'project_1245',
            chapters: [
                {
                    title: "Heat and Motion",
                    id: "chapter_124552",
                    elements: [
                        {
                            id: "asdwasd",
                            type: 0,
                            content: "oisdhkashdkajsdhasjkdaksdhaskdaskdhaskdhasldlkashdalskdhalskdhasldhasdkhaskldhasldhaskldASDSASADSaSSD"
                        },
                        {
                            id: "aaaaaa2222222",
                            type: 1,
                            content: "TBD"
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
                        
                        {
                            id: "eewqqw",
                            type: 0,
                            content: "YODL DI DUDLE \"YODL DI DUDLE\"YODL DI DUDLE\"YODL DI DUDLE\"YODL DI DUDLE"
                        },
                        {
                            id: "KKOOS",
                            type: 0,
                            content: "Wutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIII Wutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIIIWutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIII"
                        }
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
                    ]

                }
            ]
        }
    ]
}

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
        //get
        const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(oasysSessionKey))
        sessionKeys.forEach(key => {
            allWithID.find(el => oasysSessionKey + el['id'] === key).content = JSON.parse(sessionStorage.getItem(key)).content;
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

    onAddElement(typeSelected) {
        console.log('type::', typeSelected)
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
                               chapters={this.state.project.chapters}
                               {...this.props} //router fucking needs it for CoreUI React ?>?!?!?>!
                />
                <main className="main">
                    <Container fluid>

                        <button
                            onClick={() => this.toggle('isEditMode')}>{this.state.isEditMode ? 'Preview' : 'Edit'}</button>
                        <input type="text"
                               name="Chapter Title"
                               onChange={(ev) => this.onChangeChapterTitle(ev.target.value)}
                            // defaultValue={this.state.project.chapters[this.state.currChapIdx].title}
                               value={this.state.project.chapters[this.state.currChapIdx].title}

                        />
                        {elements.map(el =>
                            <Element
                                key={el.id}
                                isPreview={! this.state.isEditMode}
                                data={el}
                                onDelete={this.onDeleteElement}
                                onMove={this.onMoveElement}
                                onChange={this.onChangeContent}
                            />
                        )}
                    </Container>
                </main>
            </div>
        )
    }
}

export default LessonMaker;