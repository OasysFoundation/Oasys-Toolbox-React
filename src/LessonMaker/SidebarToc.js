import React, {Component} from 'react';
import ReactTooltip from "react-tooltip"
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as tocjs from '../assets/scripts/toc.js'
import mapStoreToProps from "../store/mapStoreToProps";
import actions from "../store/actions";
import {connect} from "redux-zero/react";
import SideBarLesson from "./SideBarLesson";


class SidebarToc extends Component {

    /*
    We expect the props chapters and currChapIdx here.
    */
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

        this.updateToc();
        this.mounted = false;

        this.state = {
            width: this.opt.width,
        };
    }

    updateToc() {
        this.chaptersExt = this.props.chapters;
        let idobj = {};
        this.chaptersExt.map((e, i) => idobj[e.id] = i);
        this.chaptersExt.forEach((e, i) => {
            e.idx = i;
            this.props.activeChapterIndex === i ? e.active = true : e.active = false;
            if (e.links === undefined) {
                throw new Error('Chapter object must have links array as property (can be empty)!');
            }
            e.linkIdx = [];
            e.links.map(f => e.linkIdx.push(idobj[f.chapterId]))
        })
        let mainPath = tocjs.longestPath(this.chaptersExt);
        let tocInfo = tocjs.prepareToc(mainPath, this.chaptersExt);
        tocInfo = tocjs.sortIntoTocLevels(tocInfo, this.chaptersExt, mainPath);
        tocInfo = tocjs.reorderX(tocInfo);
        this.tocInfo = tocjs.insertArrowLocs(tocInfo, this.opt);
        let nLevels = 1 + Math.max(...this.tocInfo.map(e => e.level))
        this.height = nLevels * this.opt.rectHeight + (nLevels - 1) * this.opt.gapy;
    }

    handleChangeChapter(id) {
        this.props.onChangeActiveChapter(id);
    }

    drawToc() {
        let svg = document.getElementById(this.opt.tocId);
        svg.parentNode.replaceChild(svg.cloneNode(false), svg);
        tocjs.drawChapters(this.tocInfo, this.chaptersExt, this.opt);
        tocjs.drawConnections(this.tocInfo, this.opt);
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
        this.drawToc();
        this.mounted = true;
    }

    // TODO: it appears that both componentWillReceiveProps and shouldComponentUpdate are fired if
    // the incoming props change. However, here we should not have to react to changes within one
    // chapter! Thus, we want to receive only part of the LessonMaker's state as the prop.
    componentWillReceiveProps() {
        //console.log('receive');
        //console.log(this.title);
        //this.updateToc();
        return true
    }

    shouldComponentUpdate() {
        // TODO: check if this is fired if incoming chapters props changed
        this.updateToc();
        if (this.mounted) {
            this.drawToc();
        }
        return true;
    }

    render() {
        return (
            <div>
                <svg
                    className="svgTocWrap"
                    xmlns="http://www.w3.org/2000/svg"
                    width={this.state.width}
                    height={this.height}
                    viewBox={"0 0 " + this.state.width + " " + this.state.height}
                >
                    <svg
                        id="toc"
                        width={this.state.width}
                        height={this.height}
                        viewBox={"0 0 " + this.state.width + " " + this.state.height}
                    >
                    </svg>
                </svg>
                <div ref='tooltipWrapper'/>
            </div>
        );
    }
}

// export default connect(mapStoreToProps, actions)(SidebarToc);

SidebarToc.propTypes = {
    onChangeActiveChapter: PropTypes.func.isRequired,
    chapters: PropTypes.array.isRequired,
    activeChapterIndex: PropTypes.number.isRequired
};

//only take what you need
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    const {onChangeActiveChapter, project} = propsFromStore;
    const {chapters, activeChapterIndex} = project;
    return React.createElement(SidebarToc, {onChangeActiveChapter, chapters, activeChapterIndex});
});