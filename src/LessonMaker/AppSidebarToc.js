import React, {Component} from 'react';

import * as tocjs from '../assets/scripts/toc.js'

class AppSidebarToc extends Component {

    componentDidMount(){
        const opt = {
            tocId: 'toc',
            totalWidth: 300,
            rectHeight: 35,
            gapx: 5,
            gapy: 10,
            arrowOffset: 0.04, // in percent of total width
            //arrowColor: '#F8F8F4',
            arrowColor: '#aa0000',
            arrowStroke: 4,
            backgroundColor: '#ffffff',
            rectColorStart: '#3f51d5',
            rectColorEnd: '#3f51d5',
            rectColorDefaultFill: '#30444D',
            rectColorDefaultStroke: '#626970',
            textColor: '#eeeeee',
            myOrange: '#C85C0D',
        }

        let chapters = [
            {idx: 0, title: 'Chapter 1: Wow me introduction', links: [1,3]},
            {idx: 1, title: 'Chapter 2: How to Wow', links: [2,3]},
            {idx: 2, title: 'Chapter 3a: Text', links: [4]},
            {idx: 3, title: 'Chapter 3b: Sim', links: [4,0]},
            {idx: 4, title: 'Chapter 4: Interlude', links: [5]},
            {idx: 5, title: 'Chapter 5: In depth wowing', links: [4,6,7,8,9,10,11]},
            {idx: 6, title: 'Chapter6a', links: [13]},
            {idx: 7, title: 'Chapter6b', links: [13]},
            {idx: 8, title: 'Chapter6c', links: [13]},
            {idx: 9, title: 'Chapter6d', links: [12]},
            {idx: 10, title: 'Chapter6e', links: [13]},
            {idx: 11, title: 'Chapter6f', links: [13]},
            {idx: 12, title: 'Secret', links: [5]},
            {idx: 13, title: 'Final test', links: []},
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
            <svg xmlns="http://www.w3.org/2000/svg">
                <svg id="toc" width="300" height="800" viewBox="0 0 300 800">
                </svg>
            </svg>
        );
    }
}

export default AppSidebarToc;
