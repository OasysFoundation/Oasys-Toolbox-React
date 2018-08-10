import React, {Component} from 'react';
import ReactTooltip from "react-tooltip"
import ReactDOM from 'react-dom';

import * as tocjs from '../assets/scripts/toc.js'

class SidebarToc extends Component {

    constructor(props) {
        super(props);

        const width = 200;

        this.opt = {
            tocId: 'toc',
            totalWidth: width,
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
            rectColorDefaultFill: '#30444D',
            rectColorDefaultStroke: '#626970',
            textColor: '#eeeeee',
            myOrange: '#C85C0D',
            handleClick: this.handleChangeChapter,
            handleHover: this.handleMouserOver,
        }

        console.log(this.props.chapters)

        this.chapters = [
            {idx: 0, title: 'Chapter 1: Wow me introduction', linkIdx: [1,3], 'active': true},
            {idx: 1, title: 'Chapter 2: How to Wow', linkIdx: [2,3], 'active': false},
            {idx: 2, title: 'Chapter 3a: Text', linkIdx: [4], 'active': false},
            {idx: 3, title: 'Chapter 3b: Sim', linkIdx: [4,0], 'active': false},
            {idx: 4, title: 'Chapter 4: Interlude', linkIdx: [5], 'active': false},
            {idx: 5, title: 'Chapter 5: In depth wowing', linkIdx: [4,6,7,8,9,10,11], 'active': false},
            {idx: 6, title: 'Chapter6a', linkIdx: [11], 'active': false},
            {idx: 7, title: 'Chapter6b', linkIdx: [11], 'active': false},
            {idx: 8, title: 'Chapter6c', linkIdx: [11], 'active': false},
            {idx: 9, title: 'Chapter6e', linkIdx: [11], 'active': false},
            {idx: 10, title: 'Chapter6f', linkIdx: [11], 'active': false},
            {idx: 11, title: 'Final test', linkIdx: [], 'active': false},
        ];

        this.updateToc();
        let nLevels = 1 + Math.max(...this.tocInfo.map(e=>e.level))
        let height = nLevels * this.opt.rectHeight + (nLevels-1) * this.opt.gapy;

        this.state = {
            height: height,
            width: width,
        };
    }

    updateToc(){
        let mainPath = tocjs.longestPath(this.chapters);
        let tocInfo = tocjs.prepareToc(mainPath, this.chapters);
        tocInfo = tocjs.sortIntoTocLevels(tocInfo, this.chapters, mainPath);
        tocInfo = tocjs.reorderX(tocInfo);
        this.tocInfo = tocjs.insertArrowLocs(tocInfo, this.opt);
    }

    handleChangeChapter(num){
        console.log("change to chapter " + num);
    }

    componentDidMount(){
        tocjs.drawChapters(this.tocInfo, this.chapters, this.opt);
        tocjs.drawConnections(this.tocInfo, this.opt);
        for (let i=0;i<this.chapters.length;i++) {
            let idx = this.chapters[i].idx;
            let elem = <ReactTooltip id={'toc-'+idx}> {this.chapters[i].title} </ReactTooltip>
            ReactDOM.render(elem, document.getElementById("tooltip-"+idx));
        }
    }

    componentWillReceiveProps(){
        // TODO: check if this is fired if incoming chapters props changed
    }

    shouldComponentUpdate(){
        // TODO: check if this is fired if incoming chapters props changed
    }

    render() {
        return (
            <div>
                <svg 
                    className ="svgTocWrap"
                    xmlns="http://www.w3.org/2000/svg" 
                    width={this.state.width} 
                    height={this.state.height} 
                    viewBox={"0 0 this.state.width this.state.height"}
                >
                    <svg 
                        id="toc" 
                        width={this.state.width} 
                        height={this.state.height} 
                        viewBox={"0 0 this.state.width this.state.height"}
                    >
                    </svg>
                </svg>

                {this.chapters.map(e=>
                    <div id={"tooltip-"+e.idx}> </div>
                )}
                

            </div>
        );
    }
}

export default SidebarToc;
