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

import AppSidebarToc from "./AppSidebarToc";

const navParams =  {
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
            title: true,
            name: 'K-12',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Physics',
            url: '/explore/physics',
            icon: 'icon-pencil',
            children: [
                {
                    name: 'Energy',
                    url: '/explore/physics/energy',
                    icon: 'icon-pencil',
                },
                {
                    name: 'Nuclear',
                    url: '/explore/physics/nuclear',
                    icon: 'icon-pencil',
                },
                {
                    name: 'Fluids',
                    url: '/explore/physics/fluids',
                    icon: 'icon-pencil',
                },
            ]
        },
        {
            name: 'Chemistry',
            url: '/explore/chemistry',
            icon: 'icon-pencil',
        },
        {
            name: 'Maths',
            url: '/explore/maths',
            icon: 'icon-pencil',
        },
        {
            name: 'Coding',
            url: '/explore/coding',
            icon: 'icon-pencil',
        },
        {
            title: true,
            name: 'University',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Mechanical engineering',
            url: '/explore/mechineering',
            icon: 'icon-pencil',
        },
        {
            name: 'Nanomaterials',
            url: '/explore/nano',
            icon: 'icon-pencil',
        },
        {
            name: 'Medicine',
            url: '/explore/medicine',
            icon: 'icon-pencil',
        },
    ],
};

class SideBarLesson extends Component {
    //title, tags
    // {...this.props}
    render() {
        return (

            <AppSidebar fixed display="lg">
                    <AppSidebarHeader/>
                    <AppSidebarForm/>
                    <AppSidebarNav navConfig={navParams} {...this.props}/>
                    <AppSidebarToc/>
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>
        )
    }
}

{/*<div style={this.props.style}>*/}
    {/*<section>Category</section>*/}
    {/*<section>Tags</section>*/}
    {/*<button>Settings</button>*/}
    {/*<button>ToC</button>*/}
    {/*<button onClick={this.props.onAddChapter}>Add Chapter</button>*/}
    {/*{this.props.chapters.map(chap =>*/}
        {/*<button key={chap.id}*/}
                {/*onClick={() => this.props.onChapterChange(chap.id)}> {" -- " + chap.title + " -- "}*/}
        {/*</button>*/}
    {/*)}*/}
    {/*<ElementAdder onAddElement={this.props.onAddElement}/>*/}

{/*</div>*/}

SideBarLesson.propTypes = {
    onChapterChange: PropTypes.func.isRequired,
    onAddChapter: PropTypes.func.isRequired,
    chapters: PropTypes.array
};

export default SideBarLesson;
