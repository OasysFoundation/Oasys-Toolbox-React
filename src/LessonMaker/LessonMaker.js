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


const Item = posed.div();

class LessonMaker extends Component {
    state = {
        // project: MockData.projects[0],
        currChapIdx: 0,
        isEditMode: true,
    };

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
                {/*{this.props.onAddChapter()}*/}
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
                                        chaptersLight={this.props.project.chapters.map(c => ({title:c.title, id: c.id}) )}
                                    />
                                    <ElementAdder
                                        key={el.id + 1}
                                        onAddElement={this.props.onAddElement}
                                        idx={idx}
                                        nElems={activeChapter.elements.length} />
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