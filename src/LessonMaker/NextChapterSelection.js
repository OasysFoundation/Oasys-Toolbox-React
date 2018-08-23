import React, { Component } from 'react';
import SelectionDropdown from './SelectionDropdown'
import uuidv4 from "uuid/v4"
import { Button } from 'reactstrap';
import CreateNewChapterModal from './CreateNewChapterModal'

//this is the new "Preview" Component
class NextChapterSelection extends Component {

    
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
        }).title;

        return title? title : "No Chapter Selected";
    }

    chapterIndexForIdentifier(identifier) {
        var chapterIndex = null;
        this.getAllChapters().forEach(function(chapter, index) {
            if (chapter.id == identifier) {
                chapterIndex = index;
            }
        });
        return chapterIndex;
    }

    getAllChapters() {
        return this.state.userCreatedChapters.concat(this.props.chapters);
    }

    getActionMenuItems() {
        var menuItems = this.getAllChapters().map(function(element) { return "Go to " + element.title + "…"});
        menuItems.push("Create new Chapter…");
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

        console.log(identifier, chapterIndex, "id, idx")

        if (chapterIndex >= this.getAllChapters().length) {
            const that = this;
            this.createNewChapter().then(function(newChapter) {
                const newChapterIndex = that.chapterIndexForIdentifier(newChapter.id);
                that.onSelectAction(newChapter.id, newChapterIndex);
                that.props.onAddChapter(newChapter.id, that.chapterTitleForIdentifier(newChapter.id));
            });
            return;
        }


        const newAction = this.getAllChapters()[chapterIndex].id;
        this.props.onChange({
            action: newAction
        }, true, true);
    }

    onContinue() {
        
    }
    

    render() {
        const action = this.props.data? this.props.data.action : "";
        const that = this;
        return (
            <div className='next-chapter'>
                <center>
                    <CreateNewChapterModal isOpen={this.state.showsCreateNewChapterDialog} onClose={this.onCloseNewChapterCreationDialog.bind(this)} onCreateNewChapter={this.onCreateNewChapter.bind(this)} />
                    {this.props.isEditMode? (
                            <div>
                            <h3>Continue to…</h3>
                            <SelectionDropdown onSelect={this.onSelectAction.bind(this)} identifier={Math.random().toString()} default={action!=null? this.chapterTitleForIdentifier(action) : "No Action"} options={this.getActionMenuItems()}/>
                            </div>
                        ) : (
                            <Button color="primary" onClick={function() { that.onContinue(action) }} style={{marginBottom: '15px'}}> Continue… </Button>
                        )
                    }
                </center>
            </div>
        )
    }
}

export default NextChapterSelection;
