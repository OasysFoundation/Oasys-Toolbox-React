import React, {Component} from 'react';

import * as tocjs from '../assets/scripts/toc.js'

class SidebarToc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 500,
            width: 200,
        };
    }

    handleChangeChapter(num){
        console.log("change to chapter " + num);
    }

    componentDidMount(){
        const opt = {
            tocId: 'toc',
            totalWidth: this.state.width,
            rectHeight: 35,
            gapx: 5,
            gapy: 15,
            arrowOffset: 0.05, // in percent of total width
            arrowColor: '#C3C8D4',
            arrowLongColor: '#F4EFB6',
            arrowColorReverse: '#A47D90',
            arrowLongColorReverse: '#a34079', //A34079
            arrowStroke: 4,
            backgroundColor: '#2f353a',
            rectColorStart: '#3f51d5',
            rectColorEnd: '#3f51d5',
            rectColorDefaultFill: '#30444D',
            rectColorDefaultStroke: '#626970',
            textColor: '#eeeeee',
            myOrange: '#C85C0D',
            handler: this.handleChangeChapter,
        }

        let chapters = [
            {idx: 0, title: 'Chapter 1: Wow me introduction', linkIdx: [1,3]},
            {idx: 1, title: 'Chapter 2: How to Wow', linkIdx: [2,3]},
            {idx: 2, title: 'Chapter 3a: Text', linkIdx: [4]},
            {idx: 3, title: 'Chapter 3b: Sim', linkIdx: [4,0]},
            {idx: 4, title: 'Chapter 4: Interlude', linkIdx: [5]},
            {idx: 5, title: 'Chapter 5: In depth wowing', linkIdx: [4,6,7,8,9,10,11]},
            {idx: 6, title: 'Chapter6a', linkIdx: [11]},
            {idx: 7, title: 'Chapter6b', linkIdx: [11]},
            {idx: 8, title: 'Chapter6c', linkIdx: [11]},
            {idx: 9, title: 'Chapter6e', linkIdx: [11]},
            {idx: 10, title: 'Chapter6f', linkIdx: [11]},
            {idx: 11, title: 'Final test', linkIdx: []},
        ];

        // let nColors = chapters.map(e=>e.links.length).reduce((a,c)=>a+c);
        // let allColors = palette('tol-rainbow', nColors);

        let mainPath = tocjs.longestPath(chapters);
        let tocInfo = tocjs.prepareToc(mainPath, chapters);
        tocInfo = tocjs.sortIntoTocLevels(tocInfo, chapters, mainPath);
        tocInfo = tocjs.reorderX(tocInfo);
        tocInfo = tocjs.insertArrowLocs(tocInfo, opt);

        console.log(tocInfo);

        tocjs.drawChapters(tocInfo, chapters, opt);
        tocjs.drawConnections(tocInfo, opt);
    }

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={this.state.width} height={this.state.height} viewBox={"0 0 this.state.width this.state.height"}>
                <svg id="toc" width={this.state.width} height={this.state.height} viewBox={"0 0 this.state.width this.state.height"}>
                </svg>
            </svg>
        );
    }
}

export default SidebarToc;
