import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';

import SidebarToc from "./SidebarToc";

const navParams = {
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
};

class SideBarLesson extends Component {
    //title, tags
    // {...this.props}
    render() {
        return (

            <AppSidebar fixed display="lg">
                {/*<AppSidebarHeader/>*/}
                {/*<AppSidebarForm/>*/}
                {/*<AppSidebarNav navConfig={navParams} {...this.props} style={{flex: "0 0", height: ""}}/>*/}
                <div>SETTINGS </div>
                <hr />
                <SidebarToc/>
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
