import React, {Component} from 'react';
import ReactTooltip from "react-tooltip"
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';

import * as tocjs from '../assets/scripts/toc.js'
import actions from "../store/actions";
import {connect} from "redux-zero/react";


class SidebarToc extends Component {

    constructor(props) {
        super(props);
        this.handleChangeChapter = this.handleChangeChapter.bind(this);
        this.opt = {
            tocId: 'toc',
            totalWidth: 199,
            rectHeight: 31,
            gapx: 5,
            gapy: 15,
            textpadx: 10,
            textpady: 5,
            arrowOffset: 0.05, // in percent of total width
            arrowColor: '#C3C8D4',
            arrowLongColor: '#F4EFB6',
            arrowColorReverse: '#A47D90',
            arrowLongColorReverse: '#a34079', //A34079
            arrowStroke: 4,
            backgroundColor: '#2f353a',
            rectColorStart: '#3f51d5',
            rectColorEnd: '#3f51d5',
            rectColorActiveFill: '#626970',
            rectColorDefaultFill: '#3E4B54',
            rectColorDefaultStroke: '#626970',
            textColor: '#eeeeee',
            myOrange: '#C85C0D',
            handleClick: this.handleChangeChapter,
            handleHover: this.handleMouserOver,
        }

        this.mounted = false;


        this.state = {
            width: this.opt.totalWidth,
            height: 0,
        };

    }

    updateToc(props) {
        this.chaptersExt = props.chaptersLight;
        let idobj = {};
        this.chaptersExt.map((e, i) => idobj[e.id] = i);
        this.chaptersExt.forEach((e, i) => {
            e.idx = i;
            props.activeChapterIndex === i ? e.active = true : e.active = false;
            if (e.links === undefined) {
                throw new Error('Chapter object must have links array as property (can be empty)!');
            }
            e.linkIdx = [];
            e.links.map(f => e.linkIdx.push(idobj[f.chapterId]));
        });
        let mainPath = tocjs.longestPath(this.chaptersExt);
        let tocInfo = tocjs.prepareToc(mainPath, this.chaptersExt);
        tocInfo = tocjs.sortIntoTocLevels(tocInfo, this.chaptersExt, mainPath);
        tocInfo = tocjs.reorderX(tocInfo);
        this.tocInfo = tocjs.insertArrowLocs(tocInfo, this.opt);

        let nLevels = 1 + Math.max(...this.tocInfo.map(e => e.level));
        let newHeight = nLevels * this.opt.rectHeight + (nLevels - 1) * this.opt.gapy;
        if (newHeight!==this.state.height) {
            this.setState({
                height: newHeight,
            });
        }
    }

    handleChangeChapter(id) {
        this.props.onChangeActiveChapter(id);
    }

    drawToc(props) {
        let svg = document.getElementById(this.opt.tocId);
        svg.parentNode.replaceChild(svg.cloneNode(false), svg);
        let activeElem = tocjs.drawChapters(this.tocInfo, this.chaptersExt, this.opt);
        tocjs.drawConnections(this.tocInfo, this.opt, activeElem);
        this.refs.tooltipWrapper.innerHTML = "";
        for (let i = 0; i < this.chaptersExt.length; i++) {
            const div = document.createElement("div");
            const id = this.chaptersExt[i].id;
            div.id = "tooltip-" + id;
            this.refs.tooltipWrapper.appendChild(div)
            let elem = <ReactTooltip id={'toc-' + id}> {this.chaptersExt[i].title} </ReactTooltip>
            ReactDOM.render(elem, document.getElementById("tooltip-" + id));
        }
    }

    componentDidMount() {
        this.updateToc(this.props);
        this.drawToc(this.props);
        this.mounted = true;
    }

    componentWillReceiveProps(nextprops){
        let isChanged = false;
        // yes: we have to MANUALLY compare if the objects are the same because somehow JSON.stringify does not WORK!
        for (let i=0; i<nextprops.chaptersLight.length; i++) {
            if (nextprops.chaptersLight[i].title !== this.props.chaptersLight[i].title) { isChanged=true; break; }
            if (nextprops.chaptersLight[i].id !== this.props.chaptersLight[i].id) { isChanged=true; break; }
            for (let j=0; j<nextprops.chaptersLight[i].links; j++) {
                if (nextprops.chaptersLight[i].links[j].id !== nextprops.chaptersLight[i].links[j].id) {isChanged=true; break; }
            }
            if (isChanged) { break; }
        }

        if (isChanged || this.props.activeChapterIndex !== nextprops.activeChapterIndex) {
            this.updateToc(nextprops);
            if (this.mounted) {
                this.drawToc(nextprops);
            }
            console.log('toc re-renders');
        } 
    }

    render() {
        return (
            <div>
                <svg
                    className="svgTocWrap"
                    xmlns="http://www.w3.org/2000/svg"
                    totalWidthh={this.state.width}
                    height={this.state.height}
                    viewBox={"0 0 " + this.state.width + " " + this.state.height}
                >
                <g id="toc"/>
                </svg>
                <div ref='tooltipWrapper'/>
            </div>
        );
    } 
}

// export default connect(mapStoreToProps, actions)(SidebarToc);

SidebarToc.propTypes = {
    onChangeActiveChapter: PropTypes.func.isRequired,
    chaptersLight: PropTypes.array.isRequired,
    activeChapterIndex: PropTypes.number.isRequired
};

/*
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    const {onChangeActiveChapter, project} = propsFromStore;
    const {chapters, activeChapterIndex} = project;
    return React.createElement(SidebarToc, {
        onChangeActiveChapter, 
        chapters: chapters.map(c => ({title:c.title, id: c.id, links: c.links})),
        activeChapterIndex
    });
});
*/





const mapStoreToProps = ({activeChapterIndex, chapters}) => ({chaptersLight: chapters.map(c => ({title:c.title, id: c.id, links: c.links})) , activeChapterIndex});

//don't need anything!
const neededActions = (store) => {
    const {onChangeActiveChapter} = actions();
    return {onChangeActiveChapter}
};

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there
export default connect(mapStoreToProps, actions)(SidebarToc);