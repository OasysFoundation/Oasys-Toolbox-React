import React, { Component } from 'react';
import SelectionDropdown from './SelectionDropdown';
import uuidv4 from 'uuid/v4';
//import { Button } from 'reactstrap';
import CreateNewChapterModal from './CreateNewChapterModal';
import {ICON} from '../utils/trickBox';

// This component is weird: It implements continue in ContentView, and AddNewChappter in EditView
// ----> REFACTOR
class EndOfChapterEdit extends Component {
    
    state = {
        userCreatedChapters: [],
        showsDropDown: false,
        showsCreateNewChapterDialog: false,
        newChapterCreatedResolver: null
    }

    chapterTitleForIdentifier(identifier) {
        const title = this.getAllChapters().reduce(function(result, currentChapter) { 
            if (currentChapter.id === identifier) {
                return currentChapter;
            }
            return result; 
        }, '').title;

        if (identifier === 'end-lesson') {
            return "End Lesson";
        }

        return title? title : "No Chapter Selected";
    }

    chapterIndexForIdentifier(identifier) {
        var chapterIndex = null;
        this.getAllChapters().forEach(function(chapter, index) {
            if (chapter.id === identifier) {
                chapterIndex = index;
            }
        });
        return chapterIndex;
    }

    getAllChapters() {
        const that = this;
        return this.state.userCreatedChapters.concat(this.props.chapters.filter(function(element, index) {
            return index!==that.props.activeChapterIndex;
        }));
    }

    getActionMenuItems() {
        var menuItems = this.getAllChapters().map(function(element) { return "Go to " + element.title + "…"});
        menuItems.push("Create new Chapter…");
        menuItems.push("End Lesson");
        return menuItems;
    }


    createNewChapter() {
        this.setState({
            showsCreateNewChapterDialog: true
        });
        const that = this;
        return new Promise(function(resolve, reject) {
            that.setState({
                newChapterCreatedResolver: resolve
            });
        })
    }

    onCloseNewChapterCreationDialog() {
        this.setState({
            showsCreateNewChapterDialog: false
        });
    }

    onCreateNewChapter(newChapterName) {
        const newUuid = uuidv4();
            
        const userCreatedChapters = this.state.userCreatedChapters;
        userCreatedChapters.push({
            title: newChapterName,
            id: newUuid
        });

        this.setState({
            userCreatedChapters: userCreatedChapters
        }, function() {
            this.state.newChapterCreatedResolver({
                title: newChapterName,
                id: newUuid
            });
        });
    }

    onSelectAction(identifier, chapterIndex) {

        if (chapterIndex === this.getAllChapters().length) {
            const that = this;
            this.createNewChapter().then(function(newChapter) {
                const newChapterIndex = that.chapterIndexForIdentifier(newChapter.id);
                that.onSelectAction(newChapter.id, newChapterIndex);
                that.props.handleAddChapter(newChapter.id, that.chapterTitleForIdentifier(newChapter.id));
            });
            return;
        }

        if (chapterIndex === this.getAllChapters().length+1) {
            this.props.handleAction({type: 'save', value: {action: 'end-lesson'}});
            return;
        }


        const newAction = this.getAllChapters()[chapterIndex].id;
        this.props.handleAction({type: 'save', value: {action: newAction}});
    }

    onContinue() {
        this.props.handleAction({type: 'changeChapter', value: this.props.data.action});
    }
    
    componentDidMount() {
        this.props.handleReady(true);
    }

    render() {
        const action = this.props.data? this.props.data.action : null;
        const that = this;
        return (
            <div className='next-chapter'>
                <center>
                    <hr/>
                    <CreateNewChapterModal 
                        isOpen={this.state.showsCreateNewChapterDialog} 
                        onClose={this.onCloseNewChapterCreationDialog.bind(this)} 
                        onCreateNewChapter={this.onCreateNewChapter.bind(this)} 
                    />
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px'}}>
                        <span style={{fontStyle: 'italic', fontSize: '1.1rem', color: '#666666', marginRight: '20px'}}>Continue to…</span>
                        <SelectionDropdown 
                            onSelect={this.onSelectAction.bind(this)} 
                            identifier={Math.random().toString()} 
                            default={(action!=null && action!=="")? this.chapterTitleForIdentifier(action) : "End Lesson"} 
                            options={this.getActionMenuItems()}
                        />
                    </div>
                </center>
            </div>
        )
    }
}

export default EndOfChapterEdit;
