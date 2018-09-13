import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {Input, FormText, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
//can I push?
import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarMinimizer,
} from '@coreui/react';
import uuidv4 from 'uuid/v4';
import {connect} from "redux-zero/react";
import actions from "../store/actions";
import SidebarToc from "./SidebarToc";
import IconSelectionModal from './IconSelectionModal'
import {ScaleLoader} from 'react-spinners';
import EditModalWarning from './EditModalWarning'
import colors from '../utils/colors';
import api from '../utils/api'
import {isEmpty} from '../utils/trickBox'



class SideBarLesson extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            showSettingsDialog: false,
            showPublishModal: false,
            showSaveModal:false,
            showProjectsDialog: false,
            isCurrentlySavingDraft: false,
            isCurrentlyPublishing: false,
            data:[],
            doneLoading:false,
            activeTab: 1,
            showsEditDialog: false,
            errorTitle: true,
            errorDescription: true,
            errorConsistency: false,
        }

        this.title = props.title;
        this.tags = props.tags.join(" ");
        this.description = props.description;

        this.toggle = this.toggle.bind(this);

        this.onSettingsClose = this.onSettingsClose.bind(this);
        this.onSettingsSave = this.onSettingsSave.bind(this);
        this.handleSettingsShow = this.handleSettingsShow.bind(this);
        this.onSwitchProject = this.onSwitchProject.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.publishOrSaveContent = this.publishOrSaveContent.bind(this);

        this.getData = this.getData.bind(this);

        if (this.props.project.user.uid) {
            this.getData(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.project.user.uid) {
            return;
        }
        this.getData(nextProps);
    }

    getData(nextProps){

        this.title = nextProps.title;
        this.tags = nextProps.tags.join(" ");;
        this.description = nextProps.description;

        api.getUserContentsPreview()
           .then(json => {
               if(json && json.length){
                   this.setState({
                       data:json,
                   })
                }
               else{
                    console.log("Failed to find content")
               }
               this.setState({doneLoading:true})
           })
           .catch(err => {
               console.log(err)
               this.setState({doneLoading:true})

           })
    }

    toggle(tab, contentId) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }

        this.onSwitchProject(contentId)
    }

    handleSettingsShow() {

        this.setState({
            showSettingsDialog: true,
        });

        if (!this.hasStoryConsistency()) {
            this.setState({ errorConsistency: true });
        }

        this.checkTitleChange(this.props.title);
        this.checkDescriptionChange(this.props.description);
    }

    onSettingsClose() {
        this.setState({
            showSettingsDialog: false,
            showPublishModal: false,
            showSaveModal: false,
        });
    }

    onSettingsSave() {

        if (this.tags != null) {
            this.props.onChangeProjectTags(this.tags.split(" "));
        }
        if (this.title != null) {
            this.props.onChangeProjectTitle(this.title);
        }

        if (this.description != null) {
            this.props.onChangeProjectDescription(this.description);
        }
    }

    onSwitchProject(contentId) {

        const project = this.state.data.find(d => d.contentId === contentId)

        this.setState({
            showProjectsDialog: false,
            showsEditDialog: (project.published===1)
        });

        this.props.setProjectInLessonMaker(project)
    }

    hasStoryConsistency(){
        // check if the lesson has at least one ending, and if the ending is reachable from the start
        let endings = [];
        this.props.project.chapters.forEach((chapter,chidx)=>
            chapter.links.forEach(link=>{
                if (link.chapterId==='end-lesson'){
                    endings.push(chidx)
                }
            })
        );
        // replace current chapter idx with the idx of the chapter that links to current chapter 
        // until we have reached the beginning
        const chids = this.props.project.chapters.map(ch=>ch.id);
        for (let i=0;i<100;i++) {
            if (endings.indexOf(0)>=0) {
                return true;
            }
            let tendings = [];
            for (let j=0;j<endings.length;j++) {
                this.props.project.chapters.forEach((chapter,chidx)=>
                   chapter.links.forEach(link=>{ 
                        const newidx = chids.findIndex(el=>el===link.chapterId);
                        if (newidx===endings[j]){
                            tendings.push(chidx)
                        }
                    })
                );
            }
            endings = tendings;
            if (tendings.length===0) {
                break;
            }
        }
        return false;
    }

    publishOrSaveContent() {

        this.onSettingsSave();

        if (this.state.errorTitle || this.state.errorDescription) {
            return;
        }

        if (!this.hasStoryConsistency()) {
            this.setState({
                errorConsistency: true,
            })
            return;
        }

        this.setState({ showSettingsDialog: false});

        if (this.state.showPublishModal && this.title && this.description) {
            this.saveContent(1);
            this.setState({showPublishModal: false});
        } 
        else if (this.state.showSaveModal && this.title && this.description) {
            this.saveContent(0);
            this.setState({showSaveModal: false});
        }
        else if (this.state.showSettingsDialog) {
            this.onSettingsSave();
        }
    }

    saveContent(flag) {
        console.log(this.props)

        this.props.instantUpdateElements(true);

        //wait until elements instant update and update the store
        //otherwise content is inside tempContent...for performance reasons
        window.setTimeout(() => {
            const {title, tags, description, contentId, user, iconName} = this.props.project;
            const data = {
                chapters: this.props.project.chapters
            }


            const allData = {
                title, tags, description, contentId, user,
                published: flag, featured: flag, iconName, 

                data
            }

            if (flag === 0) {
                this.setState({
                    isCurrentlySavingDraft: true
                });
            } else {
                this.setState({
                    isCurrentlyPublishing: true
                });
            }

            api.postContent(allData).then(() => {
                this.setState({
                    isCurrentlySavingDraft: false,
                    isCurrentlyPublishing: false,
                });
                const snackbarMessage = flag ? "Published Successfully ✅" : "Saved Draft Successfully ✅";
                this.props.sendSnackBarMessage(snackbarMessage);
            }).catch((error) => {
                this.setState({
                    isCurrentlySavingDraft: false,
                    isCurrentlyPublishing: false,
                });
                const errorMessage = flag ? "Error: Could not publish" : "Error: Could not save draft";
                this.props.sendSnackBarMessage(errorMessage);
                console.log(error);
            });

        }, 800)

    }

    onCloseIconSelectionModal() {
        this.setState({
            showsIconSelectionModal: false
        })
    }

    onShowIconSelectionModal() {
        console.log("click!");
        this.setState({
            showsIconSelectionModal: true
        })
    }

    onCloseEditWarning() {
        this.setState({
            showsEditDialog: false
        })
    }

    onRemix() {
        const project = JSON.parse(JSON.stringify(this.props.project));
        project.contentId = uuidv4();
        project.title = project.title + " [Remixed]";

        this.props.setProjectInLessonMaker(project);

        this.onCloseEditWarning();
    }

    checkTitleChange(value) {
        if (value.length>40) {
            value = value.substring(0,40);
        }
        let title = value.trim();
        if (title.length===0) {
            this.setState({errorTitle: true});
        } else {
            this.setState({errorTitle: false});
            this.title = title;
        }
    }

    checkDescriptionChange(value) {
        if (value.length>500) {
            value = value.substring(0,500);
        }
        let description = value.trim();
        if (description.length===0) {
            this.setState({errorDescription: true});
        } else {
            this.setState({errorDescription: false});
            this.description = description;
        }
    }

    render() {
        return (
            <div>
                <IconSelectionModal isOpen={this.state.showsIconSelectionModal} onSelect={this.props.onChangeIconName}
                                    onClose={this.onCloseIconSelectionModal.bind(this)}/>
                <Modal isOpen={this.state.showSettingsDialog || this.state.showPublishModal || this.state.showSaveModal}
                       toggle={this.onSettingsClose} backdrop={true}>
                    <ModalHeader>
                        Settings
                    </ModalHeader>
                    <ModalBody>
                        <center>
                            <div style={{position: 'relative', width: '100px', height: '100px', marginBottom: '20px', cursor: 'pointer'}}
                                 onClick={this.onShowIconSelectionModal.bind(this)}>
                                <img src={require('../assets/category-icons/' + this.props.iconName)} width='100px'
                                     height='100px' alt=''/>
                                <div style={{position: 'absolute', top: '0', right: '0'}}>
                                    <i className="fas fa-align-right fa-lg fa-edit"
                                       onClick={this.onShowIconSelectionModal.bind(this)}></i>
                                </div>
                            </div>

                        </center>
                        <Input
                            defaultValue={this.props.title}
                            onChange={e=>this.checkTitleChange(e.target.value)} 
                            style={{borderColor: this.state.errorTitle?colors.VELVET:colors.GULLGREY}}
                        />
                        <FormText 
                            color={this.state.errorTitle?'danger':'muted'}
                            style={{marginBottom: '10px'}}>
                            The title is for this lesson is required and may have 40 characters at most.
                        </FormText>
                        <Input
                            type='textarea'
                            style={{borderColor: this.state.errorDescription?colors.VELVET:colors.GULLGREY}}
                            rows='4'
                            defaultValue={this.props.description}
                            onChange={e=>this.checkDescriptionChange(e.target.value)} 
                            placeholder='Please add a description'
                        />
                        <FormText 
                            color={this.state.errorDescription?'danger':'muted'}
                            style={{marginBottom: '10px'}}>
                            The description is required and may have 500 characters at most.
                        </FormText>
                        <Input
                            defaultValue={this.props.tags.join(" ")}
                            onChange={e => this.tags = e.target.value}
                            placeholder='Please add tags separated by space'
                        />
                        <FormText color="muted">
                            Tags are being used to inform the learner about the context. For example. you can use
                            subject areas like 'physics' or 'maths', or describe the type of experience, e.g.
                            'storyline' or 'simulation'.
                        </FormText>
                        {this.state.errorConsistency
                            ? <FormText color='danger'>
                                Attention: your current lesson is inconsistent. 
                                That means that either there is no ending (none of the chapters ends the lesson), 
                                or that the end of the lesson is not reachable from the beginning. To prevent frustrating your learners,
                                please ensure that they can successfully finish the lesson before saving it.
                              </FormText>
                            : null
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.onSettingsClose}>Cancel</Button>
                        <Button color="primary" onClick={this.publishOrSaveContent}>{this.state.showPublishModal ? 'Publish' : this.state.showSaveModal ? 'Save Draft': 'Save Settings'}</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.showProjectsDialog} toggle={() => this.setState({showProjectsDialog: false})}
                       backdrop={true}>
                    <ModalHeader> Your Projects </ModalHeader>
                    <ModalBody style={{height: "20rem", overflow:"scroll"}}>
                    {!isEmpty(this.props.project.user.uid)
                        ?this.state.doneLoading
                            ? (this.state.data && this.state.data.length
                                ? (
                                    <ListGroup id="list-tab" role="tablist">
                                        <ListGroupItem color="success">Saved Drafts</ListGroupItem>
                                       {
                                        this.state.data.map((data,idx) =>
                                            data.published!==1
                                         ? <ListGroupItem key={data.contentId} onClick={() => this.toggle(idx, data.contentId)} action active={this.state.activeTab === idx} >{data.title}</ListGroupItem>
                                         : null
                                        )} 
                                    <ListGroupItem color="success">Published Work</ListGroupItem>
                                       {this.state.data.map((data,idx) =>
                                        data.published===1  
                                         ? <ListGroupItem key={data.contentId} onClick={() => this.toggle(idx, data.contentId)} action active={this.state.activeTab === idx}>{data.title}</ListGroupItem>
                                         : null
                                        )} 
                                    </ListGroup>
                                    )
                                : "No Contents")
                            : "Loading.."
                        : "Please log in"
                    }
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"
                                onClick={() => this.setState({showProjectsDialog: false})}>Cancel</Button>
                        <Button color="primary" onClick={this.onSwitchProject}>Open</Button>
                    </ModalFooter>


                </Modal>

                <AppSidebar fixed display="lg">
                    <div className='sidebar-button title btn btn-secondary'>
                        <input
                            className='form-control'
                            // defaultValue='Untitled lesson'
                            value={this.props.title}
                            placeholder={'Untitled lesson'}
                            onChange={e => this.props.onChangeProjectTitle(e.target.value)}
                            onBlur={e=>e.target.value==='' ? e.target.value='Untitled lesson' : null}
                        />
                        <i className="fas fa-align-right fa-lg fa-cog" onClick={this.handleSettingsShow}></i>
                    </div>
                    <Button onClick={this.props.createNewProject} className='sidebar-button'>
                        <div>New Lesson</div>

                        <i className="fas fa-align-right fa-lg fa-folder-plus"></i>
                    </Button>
                    <Button onClick={() => this.setState({showProjectsDialog: true})} className='sidebar-button'>
                        <div>Open Lesson</div>

                        <i className="fas fa-align-right fa-lg fa-folder-open"></i>
                    </Button>
                    <Button onClick={() => this.setState({showSaveModal:true})} className='sidebar-button'>
                        <div>Save draft</div>
                        {this.state.isCurrentlySavingDraft ? <ScaleLoader height={15} color='white'/> : null}
                        <i className="fas fa-align-right fa-lg fa-save"></i>
                    </Button>

                    <Button onClick={() => this.setState({showPublishModal: true})} className='sidebar-button publish'>
                        <div>Publish</div>
                        {this.state.isCurrentlyPublishing ? <ScaleLoader height={15} color='white'/> : null}
                        <i className="fas fa-align-right fa-lg fa-globe-americas"></i>
                    </Button>
                    <hr/>
                    <SidebarToc/>
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>

                <EditModalWarning isOpen={this.state.showsEditDialog} contentTitle={this.props.title} onClose={this.onCloseEditWarning.bind(this)} onRemix={this.onRemix.bind(this)}/>

            </div>
        )
    }
}
