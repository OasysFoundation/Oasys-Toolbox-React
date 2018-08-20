import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarMinimizer,
} from '@coreui/react';

import {connect} from "redux-zero/react";
import actions from "../store/actions";
import SidebarToc from "./SidebarToc";

import api from '../api'

class SideBarLesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingsDialog: false,
            showProjectsDialog: false,
        }
        this.title = null;
        this.tags = null;
        this.description = null;

        this.onSettingsClose = this.onSettingsClose.bind(this);
        this.onSettingsSave = this.onSettingsSave.bind(this);
        this.onSettingsShow = this.onSettingsShow.bind(this);
        this.onSwitchProject = this.onSwitchProject.bind(this);
    }

    onSettingsShow() {
        this.setState({
            showSettingsDialog: true,
        });
    }

    onSettingsClose() {
        this.setState({
            showSettingsDialog: false,
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

    onSwitchProject() {
        this.setState({
            showProjectsDialog: false,
        });
    }

    saveContent() {
        // api.postContent('content', 'idtoken')
    }

    publishContent() {
        // api.postContent()
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.showSettingsDialog} toggle={this.onSettingsClose} backdrop={true}>
                    <ModalHeader>
                        Settings
                    </ModalHeader>
                    <ModalBody>
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
                        <Button color="primary" onClick={this.onSettingsSave}>Save</Button>

                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.showProjectsDialog} toggle={() => this.setState({showProjectsDialog: false})} backdrop={true}>
                    <ModalHeader> Your Projects </ModalHeader>
                    <ModalBody>
                        --EMBED Robbies project page here ---
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({showProjectsDialog: false})}>Cancel</Button>
                        <Button color="primary" onClick={this.onSwitchProject}>Save</Button>
                    </ModalFooter>


                </Modal>

                <AppSidebar fixed display="lg">
                    <Button className='sidebar-button title '>
                        <input
                            className='form-control'
                            // defaultValue='Untitled lesson'
                            value={this.props.title || 'Untitled lesson'}
                            onChange={e => this.props.onChangeProjectTitle(e.target.value)}
                        />
                        <i className="fas fa-align-right fa-lg fa-cog" onClick={this.onSettingsShow}></i>
                    </Button>
                    <Button onClick={() => this.setState({showProjectsDialog: true})} className='sidebar-button'>
                        <div>Open Project</div>

                        <i className="fas fa-align-right fa-lg fa-folder-open"></i>
                    </Button>
                    <Button onClick={this.saveContent} className='sidebar-button'>
                        <div>Save draft</div>

                        <i className="fas fa-align-right fa-lg fa-save"></i>
                    </Button>
                    <Button onClick={this.publishContent} className='sidebar-button publish'>
                        <div>Publish</div>
                        <i className="fas fa-align-right fa-lg fa-globe-americas"></i>
                    </Button>
                    <hr/>
                    <SidebarToc/>
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>
            </div>
        )
    }
}


SideBarLesson.propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired
};

//TODO --> only take out project data (not auth etc)
const mapStoreToProps = (store) => ({project: store});


// only take what you need
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    const {project, onChangeProjectTitle, onChangeProjectTags, onChangeProjectDescription} = propsFromStore;
    const {title, tags, description} = project;
    return React.createElement(SideBarLesson, {
        title,
        tags,
        description,
        onChangeProjectTitle,
        onChangeProjectTags,
        onChangeProjectDescription
    });
});