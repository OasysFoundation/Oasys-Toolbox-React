import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarMinimizer,
} from '@coreui/react';

import SidebarToc from "./SidebarToc";

/* const navParams = {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer',
            badge: {
                variant: 'info',
                text: 'NEW',
            },
        },
        {
            // title: true,
            name: 'K-12',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: '',           // optional class names space delimited list for title item ex: "text-center"
            icon: 'icon-speedometer',
        },
    ],
}; */

class SideBarLesson extends Component {
    //title, tags
    // {...this.props}
    render() {
        return (
            <AppSidebar fixed display="lg">
                {/*<AppSidebarHeader/>*/}
                {/*<AppSidebarForm/>*/}
                {/*<AppSidebarNav navConfig={navParams} {...this.props} style={{flex: "0 0", height: ""}}/>*/}
                <Button className='sidebar-button title '>
                    <input className='form-control' defaultValue='Untitled lesson' />
                    <i class="fas fa-align-right fa-lg fa-cog"></i> 
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
                    chapters={this.props.chapters} 
                    currChapIdx={this.props.currChapIdx}
                    onChapterChange={this.props.onChapterChange}
                />
                <AppSidebarFooter/>
                <AppSidebarMinimizer/>
            </AppSidebar>
        )
    }
}


SideBarLesson.propTypes = {
    onChapterChange: PropTypes.func.isRequired,
    onAddChapter: PropTypes.func.isRequired,
    chapters: PropTypes.array
};

export default SideBarLesson;
