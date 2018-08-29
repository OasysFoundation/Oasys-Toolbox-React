import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {Input, FormText, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarMinimizer,
} from '@coreui/react';

import {connect} from "redux-zero/react";
import actions from "../store/actions";
import SidebarToc from "./SidebarToc";

import api from '../utils/api'

import IconSelectionModal from './IconSelectionModal'

import {ScaleLoader} from 'react-spinners';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class SideBarLesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingsDialog: false,
            showPublishModal: false,
            showProjectsDialog: false,
            isCurrentlySavingDraft: false,
            isCurrentlyPublishing: false,
            snackbarMessage: null,
            data:[],
            doneLoading:false,
            activeTab: 1,
        }

        this.title = null;
        this.tags = null;
        this.description = null;

        this.toggle = this.toggle.bind(this);

        this.onSettingsClose = this.onSettingsClose.bind(this);
        this.onSettingsSave = this.onSettingsSave.bind(this);
        this.handleSettingsShow = this.handleSettingsShow.bind(this);
        this.onSwitchProject = this.onSwitchProject.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.publishOrSaveContent = this.publishOrSaveContent.bind(this);
    }

    componentDidMount(){
        try {
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
                   })
           }
           catch (e){
               console.log(e)
           }
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
    }

    onSettingsClose() {
        this.setState({
            showSettingsDialog: false,
            showPublishModal: false,
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
        this.setState({
            showSettingsDialog: false,
        });
    }

    onSwitchProject(contentId) {
        this.setState({
            showProjectsDialog: false,
        });

        const project = this.state.data.find(d => d.contentId === contentId)

        this.props.setProjectInLessonMaker(project)
    }

    publishOrSaveContent() {
        if (this.state.showPublishModal && this.title && this.description && this.tags) {
            this.saveContent(1)
            this.setState({showPublishModal: false})
        } else if (this.state.showSettingsDialog) {
            this.onSettingsSave()
        } else {
            //keep up the dialog or cancel
            null
        }
    }

    saveContent(flag) {
        console.log(this.props)

        this.props.instantUpdateElements(true);

        //wait until elements instant update and update the store
        //otherwise content is inside tempContent...for performance reasons
        window.setTimeout(() => {
            const {title, tags, description, contentId, user} = this.props.project;
            const data = {
                chapters: this.props.project.chapters
            }


            const allData = {
                title, tags, description, contentId, user,
                published: flag, featured: flag,

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


            const that = this;
            api.postContent(allData).then(function () {

                that.setState({
                    isCurrentlySavingDraft: false,
                    isCurrentlyPublishing: false,
                    snackbarMessage: flag ? "Published Successfully ✅" : "Saved Draft Successfully ✅"
                });

            }).catch(function (error) {


                const errorMessage = flag ? "Could not publish." : "Could not save draft."

                that.setState({
                    isCurrentlySavingDraft: false,
                    isCurrentlyPublishing: false,
                    snackbarMessage: "Error: " + errorMessage + " (" + error + ") 😭"
                });
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

    onCloseSnackBar() {
        this.setState({
            snackbarMessage: null
        });
    }

    render() {
        return (
            <div>
                <IconSelectionModal isOpen={this.state.showsIconSelectionModal} onSelect={this.props.onChangeIconName}
                                    onClose={this.onCloseIconSelectionModal.bind(this)}/>
                <Modal isOpen={this.state.showSettingsDialog || this.state.showPublishModal}
                       toggle={this.onSettingsClose} backdrop={true}>
                    <ModalHeader>
                        Settings
                    </ModalHeader>
                    <ModalBody>
                        <center>
                            <div style={{position: 'relative', width: '100px', height: '100px', marginBottom: '20px'}}
                                 onClick={this.onShowIconSelectionModal.bind(this)}>
                                <img src={require('../assets/category-icons/' + this.props.iconName)} width='100px'
                                     height='100px' alt=''/>
                                <div style={{position: 'absolute', top: '0', right: '0'}}>
                                    <i class="fas fa-align-right fa-lg fa-edit"
                                       onClick={this.onShowIconSelectionModal.bind(this)}></i>
                                </div>
                            </div>

                        </center>
                        <Input
                            defaultValue={this.props.title}
                            onChange={e => this.title = e.target.value}
                        />
                        <FormText color="muted" style={{marginBottom: '10px'}}>
                            The title for this lesson may have 40 characters at most.
                        </FormText>
                        <Input
                            type='textarea'
                            rows='4'
                            defaultValue={this.props.description}
                            onChange={e => this.description = e.target.value}
                        />
                        <FormText color="muted" style={{marginBottom: '10px'}}>
                            The description will be shown to the learner before they start the lesson.
                        </FormText>
                        <Input
                            defaultValue={this.props.tags.join(" ")}
                            onChange={e => this.tags = e.target.value}
                        />
                        <FormText color="muted">
                            Tags are being used to inform the learner about the context. For example. you can use
                            subject areas like 'physics' or 'maths', or describe the type of experience, e.g.
                            'storyline' or 'simulation'.
                        </FormText>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.onSettingsClose}>Cancel</Button>
                        <Button color="primary" onClick={this.publishOrSaveContent}>{this.state.showPublishModal ? 'Publish' : 'Save Settings'}</Button>

                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.showProjectsDialog} toggle={() => this.setState({showProjectsDialog: false})}
                       backdrop={true}>
                    <ModalHeader> Your Projects </ModalHeader>
                    <ModalBody style={{height: "20rem", overflow:"scroll"}}>
                    {this.state.doneLoading
                        ? this.state.data && this.state.data.length
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
                            : "No Contents"
                        : "Loading.."
                    }
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"
                                onClick={() => this.setState({showProjectsDialog: false})}>Cancel</Button>
                        <Button color="primary" onClick={this.onSwitchProject}>Open</Button>
                    </ModalFooter>


                </Modal>

                <AppSidebar fixed display="lg">
                    <Button className='sidebar-button title'>
                        <input
                            className='form-control'
                            // defaultValue='Untitled lesson'
                            value={this.props.title || 'Untitled lesson'}
                            onChange={e => this.props.onChangeProjectTitle(e.target.value)}
                        />
                        <i className="fas fa-align-right fa-lg fa-cog" onClick={this.handleSettingsShow}></i>
                    </Button>
                    <Button onClick={() => this.setState({showProjectsDialog: true})} className='sidebar-button'>
                        <div>Open Lesson</div>

                        <i className="fas fa-align-right fa-lg fa-folder-open"></i>
                    </Button>
                    <Button onClick={() => this.saveContent(0)} className='sidebar-button'>
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

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={Boolean(this.state.snackbarMessage)}
                    autoHideDuration={6000}
                    onClose={this.onCloseSnackBar.bind(this)}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span id="client-snackbar">
                          {this.state.snackbarMessage}
                        </span>
                        }
                    />
                </Snackbar>
            </div>
        )
    }
}


SideBarLesson.propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
};

//TODO --> only take out project data (not auth etc)
const mapStoreToProps = (store) => ({project: store});


// only take what you need
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    const {project, setProjectInLessonMaker, onDeleteChapter, instantUpdateElements, onChangeProjectTitle, onChangeIconName, onChangeProjectTags, onChangeProjectDescription} = propsFromStore;
    const {title, tags, description, iconName} = project;
    return React.createElement(SideBarLesson, {
        project,
        title,
        tags,
        description,
        iconName,
        onDeleteChapter,
        setProjectInLessonMaker,
        instantUpdateElements,
        onChangeProjectTitle,
        onChangeProjectTags,
        onChangeProjectDescription,
        onChangeIconName
    });
});