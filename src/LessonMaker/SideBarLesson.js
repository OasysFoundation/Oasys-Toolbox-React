import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {
AppSidebar,
AppSidebarFooter,
AppSidebarMinimizer,
} from '@coreui/react';

import {connect} from "redux-zero/react";
import actions from "../store/actions";
import mapStoreToProps from "../store/mapStoreToProps";
import SidebarToc from "./SidebarToc";

class SideBarLesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingsDialog:false,
        }
        this.title = null;
        this.tags = null;
        this.description = null;
    }

    onSettingsShow(){
        this.setState({
            showSettingsDialog: true,
        });
    }

    onSettingsClose(){
        this.setState({
            showSettingsDialog: false,
        });
    }

    onSettingsSave(){
        if (this.tags!=null) {
            this.props.onChangeProjectTags(this.tags.split(" "));
        }
        if (this.title!=null) {
            this.props.onChangeProjectTitle(this.title);
        }

        if (this.description!=null) {
            this.props.onChangeProjectDescription(this.description);
        }
        this.setState({
            showSettingsDialog: false,
        });
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.showSettingsDialog} toggle={this.onSettingsClose.bind(this)} backdrop={true}>
                <ModalHeader>
                    Settings
                </ModalHeader>
                  <ModalBody>
                    <Input 
                        defaultValue={this.props.title}
                        onChange={e=>this.title=e.target.value}
                    />
                    <FormText color="muted" style={{marginBottom:'10px'}}>
                        The title for this lesson may have 40 characters at most.
                    </FormText>
                    <Input 
                        type='textarea'
                        rows='4'
                        defaultValue={this.props.description} 
                        onChange={e=>this.description=e.target.value}
                    />
                    <FormText color="muted" style={{marginBottom:'10px'}}>
                        The description will be shown to the learner before they start the lesson.
                    </FormText>
                    <Input 
                        defaultValue={this.props.tags.join(" ")} 
                        onChange={e=>this.tags=e.target.value}
                    />
                    <FormText color="muted">
                        Tags are being used to inform the learner about the context. For example. you can use subject areas like 'physics' or 'maths', or describe the type of experience, e.g. 'storyline' or 'simulation'.
                    </FormText>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.onSettingsClose.bind(this)}>Cancel</Button>
                    <Button color="primary" onClick={this.onSettingsSave.bind(this)}>Save</Button>
                  </ModalFooter>
                </Modal>
                    
                <AppSidebar fixed display="lg">
                    <Button className='sidebar-button title '>
                        <input 
                            className='form-control' 
                            // defaultValue='Untitled lesson'
                            value={this.props.title || 'Untitled lesson'}
                            onChange={e=>this.props.onChangeProjectTitle(e.target.value)}
                        />
                        <i class="fas fa-align-right fa-lg fa-cog" onClick={this.onSettingsShow.bind(this)}></i> 
                    </Button>
                    <Button className='sidebar-button'>
                        <div>Save draft</div>
                        
                        <i class="fas fa-align-right fa-lg fa-save"></i> 
                    </Button>
                    <Button className='sidebar-button publish'>
                        <div>Publish</div>
                        <i class="fas fa-align-right fa-lg fa-globe-americas"></i> 
                    </Button>
                    <hr />
                    <SidebarToc />
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

// only take what you need
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    const {project, onChangeProjectTitle, onChangeProjectTags, onChangeProjectDescription} = propsFromStore;
    const {title, tags, description} = project;
    return React.createElement(SideBarLesson, {title, tags, description, onChangeProjectTitle, onChangeProjectTags, onChangeProjectDescription});
});