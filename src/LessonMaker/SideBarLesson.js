import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarMinimizer,
} from '@coreui/react';

import SidebarToc from "./SidebarToc";

class SideBarLesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingsDialog:false,
        }
    }

    onChangeTitle(e) {
        this.props.onTitleChange(e.target.value);
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

    }

    render() {
        let tags = '';
        let description = '';
        let category = '';
        return (
            <div>
                <Modal isOpen={this.state.showSettingsDialog} toggle={this.onSettingsClose.bind(this)} backdrop={true}>
                <ModalHeader>
                    Settings
                </ModalHeader>
                  <ModalBody>
                    <Input 
                        placeholder="Title" 
                        value={this.props.title} 
                        onChange={this.onChangeTitle.bind(this)}
                    />
                    <FormText color="muted">
                        The title for this lesson may have 40 characters at most.
                    </FormText>
                    <Input 
                        placeholder="Description" 
                        value={tags} 
                        onChange={function(){}} 
                    />
                    <FormText color="muted">
                        Your description will be shown before the lesson starts. It should be concise and expressive.
                    </FormText>
                    <Input 
                        placeholder="Tags" 
                        value={tags} 
                        onChange={function(){}} 
                    />
                    <FormText color="muted">
                        Tags are being used to inform the learner about the context. For example, you can use tags like 'physics', or 'mathematics'.
                    </FormText>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.onSettingsClose.bind(this)}>Cancel</Button>
                    <Button color="primary" onClick={this.onSettingsSave.bind(this)}>Save</Button>
                  </ModalFooter>
                </Modal>
                    
                <AppSidebar fixed display="lg">
                    {/*<AppSidebarHeader/>*/}
                    {/*<AppSidebarForm/>*/}
                    {/*<AppSidebarNav navConfig={navParams} {...this.props} style={{flex: "0 0", height: ""}}/>*/}
                    <Button className='sidebar-button title '>
                        <input className='form-control' defaultValue='Untitled lesson' value={this.props.title} onChange={this.onChangeTitle.bind(this)} />
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
                    <SidebarToc 
                        // chapters={this.props.chapters}
                        // currChapIdx={this.props.currChapIdx}
                        // onChapterChange={this.props.onChapterChange}
                    />
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>
            </div>  
        )
    }
}


SideBarLesson.propTypes = {
    onChangeActiveChapter: PropTypes.func.isRequired,
    onAddChapter: PropTypes.func.isRequired,
    chapters: PropTypes.array
};

export default SideBarLesson;
