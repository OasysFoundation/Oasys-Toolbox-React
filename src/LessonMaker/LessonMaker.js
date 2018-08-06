import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SideBarLesson from "./SideBarLesson";
import ElementWithEdit from "./ElementWithEdit";
import Element from './Element'
import {moveEntry, withoutEntry, getObjectsByKey} from "./trickBox";

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
                            type: "text",
                            data: "oisdhkashdkajsdhasjkdaksdhaskdaskdhaskdhasldlkashdalskdhalskdhasldh" + "asdkhaskldhasldhaskld" + "ASDSASADSaSSD"
                        },
                        {
                            id: "eewqqw",
                            type: "text",
                            data: "YODL DI DUDLE \"YODL DI DUDLE\"YODL DI DUDLE\"YODL DI DUDLE\"YODL DI DUDLE"
                        },
                        {
                            id: "hibsas",
                            type: "text",
                            data: "Wutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIII Wutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIIIWutschdi Wuuuu BABABAA BAAEMM JAYJAY WOOOHIIII"
                        }
                    ]

                },
                {
                    title: "Feet and Cotion",
                    id: "chapter_99852",
                    elements: [
                        {
                            id: "OPPOK",
                            type: "text",
                            data: "YOLO DOLO JOIHSADIOHOAISDHO SAIOHDOIAHSDOI ASHDOIAHD  BAAEMM JAYJAY WOOOHIIII"
                        }
                    ]

                }
            ]
        }
    ]
}

const styling = {
    all: {
        display: 'flex',
        flexGrow: 1,
        // flexDirection: 'row',
        // flexBasis: 0,
        // width: 100 + 'vw',
    },
    sidebar: {
        flexGrow: 0.8,
        // minWidth: 33 + '%',
        // maxWidth: 200 + 'px',
        border: `1px solid black`,
        maxWidth: 270 + 'px',
        height: 100 + 'vh'
    },
    contentView: {
        flexGrow: 0, //this makes the element stay at 700px ==> so preview and edit are continous
        //otherwise it will fill everything except the sidebar space
        border: `1px solid red`,
        display: 'flex',
        flexDirection: 'column',
    }
}


class LessonMaker extends Component {
    constructor() {
        super();

        //@operations
        //Element-wise --> ElementWEdit
        this.deleteElement = this.deleteElement.bind(this);
        this.moveElement = this.moveElement.bind(this);

        //Chapter-wise --> Sidebar
        this.setActiveChapter = this.setActiveChapter.bind(this);
        this.createChapter = this.createChapter.bind(this);
        this.createElement = this.createElement.bind(this);

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
        }, 15000)
        console.log('autosaver intervall : ', this.autoSaver)
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
            console.log('found', allWithID.find(el => oasysSessionKey + el['id'] === key))
            allWithID.find(el => oasysSessionKey + el['id'] === key).data = JSON.parse(sessionStorage.getItem(key)).data;
            console.log('storage', JSON.parse(sessionStorage.getItem(key)));
        })
        this.setState({project: proj});
    }

    toggle(prop) { //used for isEditmode...
        this.setState({[prop]: !this.state[prop]})
    }

    reverseAction() { //go back in state versions

    }

    deleteElement(id) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let elements = proj.chapters[this.state.currChapIdx].elements;
        const entryIdx = elements.findIndex(el => el.id === id);

        proj.chapters[this.state.currChapIdx].elements = withoutEntry(elements, entryIdx);

        this.setState({project: proj})
    }

    createElement(typeSelected) {
        console.log('type::', typeSelected)
    }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }

    moveElement(id, direction) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let elements = proj.chapters[this.state.currChapIdx].elements;
        const entryIdx = elements.findIndex(el => el.id === id);

        proj.chapters[this.state.currChapIdx].elements = moveEntry(elements, entryIdx, direction)

        this.setState({project: proj})
    }

    changeChapterTitle(value) {
        const proj = JSON.parse(JSON.stringify(this.state.project));
        let chap = proj.chapters[this.state.currChapIdx];
        chap.title = value;
        this.setState({project: proj})
    }

    createChapter() {
        const proj = JSON.parse(JSON.stringify(this.state.project));

        proj.chapters.push(
            {
                id: Math.random().toFixed(36), title: this.state.project.title,
                title: `<<< Chapter Title XYZ >>>`,
                elements: [],
                timestamp: Date.now()
            }
        );

        console.log(proj, "project")

        this.setState({project: proj})
    }

    handleInteractionEvent(eventId) {
        //eventId => chapterId => setState(activeChapter)
    }

    render() {
        console.log('render')
        const activeChapter = this.state.project.chapters[this.state.currChapIdx];
        const {elements} = activeChapter;

        {/*<section style={styling.all}>*/}

        return (
        <div className="app-body">
            <SideBarLesson onChapterChange={this.setActiveChapter}
                           onAddChapter={this.createChapter}
                           onAddElement={this.createElement}
                           chapters={this.state.project.chapters}
                           style={styling.sidebar}
                           {...this.props} //router fucking needs it for CoreUI React ?>?!?!?>!
            />
            <main className="main">
                <Container fluid>

                    {/*<section style={styling.contentView}>*/}
                    <button
                        onClick={() => this.toggle('isEditMode')}>{this.state.isEditMode ? 'Preview' : 'Edit'}</button>
                    <input type="text"
                           name="Chapter Title"
                           onChange={(ev) => this.changeChapterTitle(ev.target.value)}
                        // defaultValue={this.state.project.chapters[this.state.currChapIdx].title}
                           value={this.state.project.chapters[this.state.currChapIdx].title}

                    />

                    {this.state.isEditMode
                        ? elements.map(el =>
                            <section key={el.id} style={{margin: 1 + 'rem'}}>
                                <ElementWithEdit
                                    key={el.id}
                                    id={el.id}
                                    data={el.data}
                                    onDelete={this.deleteElement}
                                    onMove={this.moveElement}
                                    // onSave={}
                                />
                            </section>
                        )
                        : elements.map(el =>
                            <section key={el.id} style={{margin: 1 + 'rem'}}>
                                <Element
                                    id={el.id}
                                    key={el.id}
                                    data={el.data}
                                />
                            </section>
                        )
                    }
                    {/*</section>*/}
                </Container>
            </main>
        </div>
        // </section>
    )
    }
}


LessonMaker.propTypes = {}

export default LessonMaker;