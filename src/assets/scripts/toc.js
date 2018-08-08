
const NS = 'http://www.w3.org/2000/svg';

export function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

export function longestPath(graph) {
    let start = 0;
    let paths = [];
    let pathCosts = [];
    function findAllPaths(idx, currentCost, currentPath) {
        currentPath.push(idx);
        if (graph[idx].links.length===0) {
            pathCosts.push(currentCost);
            paths.push(currentPath);
        }
        for (let i = 0; i < graph[idx].links.length; i++) {
            let child = graph[idx].links[i];
            if (child > idx) {
                findAllPaths(child, currentCost+1, currentPath.slice());
            }
        }
    }
    findAllPaths(start, 1, []);
    return paths[argMax(pathCosts)];
}

export function prepareToc(mainPath, chapters) {
    let tocInfo = [];
    for (let i=0;i<=mainPath.length-1;i++) {
        tocInfo.push({
            idx: mainPath[i],
            level: i,
            next: chapters[mainPath[i]].links.filter(e=>e>=mainPath[i]),
            prev: chapters[mainPath[i]].links.filter(e=>e<mainPath[i]),
            title: chapters[mainPath[i]].title,
            links: chapters[mainPath[i]].links,
        });
    }
    return tocInfo;
}

export function sortIntoTocLevels(tocInfo, chapters, mainPath) {
    let addTocInfo = [];
    // determine placement of all other elements
    let todo = Array.from(Array(chapters.length).keys()).filter(e => mainPath.indexOf(e) < 0);
    for (let i=0;i<todo.length;i++) {
        let idx = chapters[todo[i]].idx;
        // find element pointing to this one
        let chaps = chapters.filter(e=>e.links.indexOf(idx)>=0);
        if (chaps.length===0) {
            throw("While building TOC, a chapter was discovered that is disconnected (" + chapters[todo[i]].title + ")")
        }
        let prevElem = Math.max(0,...chaps.map(e=>e.idx).filter(e=>e<idx));
        // find first element this one points to
        let nextElem = Math.min(...chapters[idx].links.filter(e=>e>idx));
        // how many possible levels?
        let posrefs = tocInfo.map(e=>e.idx).filter(e=>e>prevElem&&e<nextElem);
        let poslevs = tocInfo.filter(e=>posrefs.indexOf(e.idx) >= 0).map(e=>e.level);
        // console.log(idx + ": " + prevElem + " - " + nextElem + " --> " + poslevs);
        // for now, always take the first possible level. Can there be none?
        if (poslevs.length===0) {
            throw("TOC: Cannot find placement for all elements off the longest path.")
        }
        addTocInfo.push({
            idx: idx,
            level: poslevs[0],
            next: chapters[idx].links.filter(e=>e>idx),
            prev: chapters[idx].links.filter(e=>e<idx),
            title: chapters[idx].title,
            links: chapters[idx].links,
        });
    }
    tocInfo.push(...addTocInfo);
    // find final element and make sure it is at the highest level
    let fin = tocInfo.filter(e=>e.links.length===0);
    if (fin.length===0 || fin.length>1) {
        throw("While building TOC, more then one final chapter was discovered.");
    }
    fin = fin[0]
    let levels = tocInfo.map(e=>e.level);
    if (fin.level < Math.max(...levels) || levels.filter(e=>e===fin.level).length > 1) {
        fin.level = Math.max(...levels) + 1;
    }
    return tocInfo;
}

export function reorderX(tocInfo) {
    let levels = tocInfo.map(e=>e.level);
    for (let i=0; i<tocInfo.length; i++) {
        tocInfo[i].nElems = (levels.reduce((a, e, k) => (e === levels[i]) ? a.concat(k) : a, []).length);
    }
    let maxPrio = Math.max(...tocInfo.map(e=>e.nElems));
    tocInfo.forEach(val =>
        val.prio = maxPrio - val.nElems + 1
    )
    // initialize x positions
    for (let i=0; i<tocInfo.length; i++) {
        let allonlvl = tocInfo.filter((e,k) => e.level===tocInfo[i].level).map(e=>e.idx);
        tocInfo[i].x = allonlvl.indexOf(tocInfo[i].idx);
    }
    // set x positions of chapters
    let allidx = tocInfo.map(e=>e.idx);
    let done = [];
    for (let i=1; i<=maxPrio; i++) {
        let ti = tocInfo.filter(e=>e.prio == i);
        for (let j=0; j<ti.length; j++) {
            if (done.indexOf(ti[j].level) >= 0) {
                continue;
            }
            done.push(ti[j].level);
            let allonlvl = tocInfo.filter(e=>e.level===ti[j].level);
            let myx = allonlvl.map(e => e.x);
            for (let k=0; k<allonlvl.length; k++) {
                let elem = allonlvl[k];
                let otherElems = tocInfo.filter(e => e.links.indexOf(elem.idx) >= 0);
                let otherXmin = otherElems.map(e => e.x / e.nElems);
                let otherXmax = otherElems.map(e => (e.x+1) / e.nElems);
                elem.xmin = elem.x / elem.nElems;
                elem.xmax = (elem.x+1) / elem.nElems;
                if (elem.xmax > Math.max(...otherXmin) && elem.xmin < Math.min(...otherXmax)) {
                    //console.log("nothing to do...")
                } else {
                    // easiest solution for now: push element onto its own level
                    tocInfo.map(e => e.level > elem.level ? e.level++ : e.level)
                    elem.level += 1;
                    elem.xmin = 0;
                    elem.xmax = 1;
                    // console.log("min/max for " + elem.title + "(" + myXmin + ", " + myXmax + ")");
                    // console.log(otherXmin);
                    // console.log(otherXmax);
                }
            }
        }
    }

    return tocInfo;
}

export function insertArrowLocs(tocInfo, opt) {
    let maxLvl = Math.max(...tocInfo.map(e=>e.level));
    let tocIdx = tocInfo.map(e=>e.idx);
    let arrowLocs = new Array(maxLvl);
    // set location for arrows
    for (let i=0; i<tocInfo.length; i++) {
        let elem = tocInfo[i];
        elem.xarrow = [];
        for (let j=0; j<elem.links.length; j++) {
            let link = tocInfo[tocIdx.indexOf(elem.links[j])];
            let loc = (Math.min(link.xmax,elem.xmax) + Math.max(link.xmin,elem.xmin)) / 2;
            // console.log("[" + link.xmin + "," + link.xmax + "]; " + "[" + elem.xmin + "," + elem.xmax + "]" + "-->" + loc)
            for (let k=Math.min(elem.level, link.level); k<Math.max(elem.level, link.level); k++) {
                if (arrowLocs[k] === undefined) {
                    arrowLocs[k] = [loc];
                } else {
                    let offset = opt.arrowOffset;
                    let sign = true;
                    let newLoc = loc;
                    while (arrowLocs[k].indexOf(newLoc) >= 0) {
                        // change arrow location on clash
                        sign ? newLoc = loc + offset : newLoc = loc - offset;
                        sign = !sign;
                        if (sign) {
                            offset += opt.arrowOffset;
                        }
                    }
                    loc = newLoc;
                    arrowLocs[k].push(loc);
                }
            }
            elem.xarrow.push(loc);
        }
    }
    console.log(arrowLocs)
    return tocInfo;
}

export function drawChapters(tocInfo, chapters, opt) {
    let maxLevel = Math.max(...tocInfo.map(e=>e.level));
    let offy = 0;
    for (let i=0; i<=maxLevel; i++) {
        let offx = 0;
        let elems = tocInfo.filter(e=>e.level === i);
        if (elems.length === 1) {
            let myrect = {x: offx, y: offy, height: opt.rectHeight, width: opt.totalWidth, colorFill: opt.rectColorDefaultFill, colorStroke: opt.rectColorDefaultStroke};
            document.getElementById(opt.tocId).appendChild(svgRect(myrect));
            let mytext = {x: offx+10, y: offy+23, text: chapters[elems[0].idx].title, color: opt.textColor};
            document.getElementById(opt.tocId).appendChild(svgText(mytext));
        } else {
            let rectWidth = Math.floor((opt.totalWidth - (elems.length - 1) * opt.gapx) / elems.length);
            for (let j=0; j<elems.length; j++) {
                let myrect = {x: offx, y: offy, height: opt.rectHeight, width: rectWidth, colorFill: opt.rectColorDefaultFill, colorStroke: opt.rectColorDefaultStroke};
                let mytext = {x: offx+10, y: offy+23, text: chapters[elems[j].idx].title, color: opt.textColor};
                document.getElementById(opt.tocId).appendChild(svgRect(myrect));
                document.getElementById(opt.tocId).appendChild(svgText(mytext));
                offx = offx + rectWidth + opt.gapx;
            }
        }
        offy = offy + opt.gapy + opt.rectHeight;
    }
}

export function drawConnections1(tocInfo, opt){
    for (let i=0; i<tocInfo.length; i++) {
        let links = tocInfo[i].links;
        for (let j=0; j<links.length; j++) {
            let elem = tocInfo.filter(e=>e.idx === links[j])[0];
            let y1 = tocInfo[i].level * (opt.gapy + opt.rectHeight);
            let y2 = elem.level * (opt.gapy + opt.rectHeight);
            let x = Math.round(opt.totalWidth*tocInfo[i].xarrow[j]);
            if (y2<y1) {
                y1 -= 1;
                y2 += opt.rectHeight + 1;
                document.getElementById(opt.tocId).appendChild(svgArrow(x, y1, y2, opt.arrowColor));
            } else {
                y1 += opt.rectHeight + 1;
                y2 -= 1;
                document.getElementById(opt.tocId).appendChild(svgArrow(x, y2, y1, opt.arrowColor));
            }
            document.getElementById(opt.tocId).appendChild(svgCircle(x, y1, opt.arrowColor, opt.arrowColor));
            document.getElementById(opt.tocId).appendChild(svgCircle(x, y2, opt.arrowColor, opt.arrowColor));
        }
    }
}

export function drawConnections2(tocInfo, opt){
    for (let i=0; i<tocInfo.length; i++) {
        let links = tocInfo[i].links;
        for (let j=0; j<links.length; j++) {
            let elem = tocInfo.filter(e=>e.idx === links[j])[0];
            let y1 = tocInfo[i].level * (opt.gapy + opt.rectHeight);
            let y2 = elem.level * (opt.gapy + opt.rectHeight);
            let x = Math.round(opt.totalWidth*tocInfo[i].xarrow[j]);
            let colorFill = opt.arrowColor;
            let colorStroke = opt.arrowColor;
            let flipped = false;
            if (y2<y1) {
                flipped = true;
                y2 += opt.rectHeight;
            } else {
                y1 += opt.rectHeight;
            }
            // if (Math.abs(tocInfo[i].level-elem.level)>1) { colorStroke = opt.myOrange; }

            document.getElementById(opt.tocId).appendChild(svgPoly(x,y1,colorFill,colorStroke));
            document.getElementById(opt.tocId).appendChild(svgPoly(x,y2,'#eeeeee',colorStroke));
        }
    }
}

export function svgPoly(x,y,color,flipped,colorStroke) {
    let poly = document.createElementNS(NS, 'polygon');
    let xoff = 6;
    let yoff = 7;
    let ytip = y+yoff;
    if (flipped) {
        ytip = y-yoff;
    }
    poly.setAttribute('fill', color);
    poly.setAttribute('points', `${x-xoff},${y} ${x},${ytip}, ${x+xoff},${y}`);
    if (colorStroke!==undefined) {
        poly.setAttribute('stroke-dasharray', 2*Math.sqrt(xoff*xoff+yoff*yoff));
        poly.setAttribute('stroke', colorStroke);
        poly.setAttribute('stroke-width', 2);
    }
    return poly;
}

export function svgRect(obj){
    let svg = document.createElementNS(NS,"rect");
    svg.width.baseVal.value=obj.width;
    svg.height.baseVal.value=obj.height;
    svg.setAttribute("x", obj.x);
    svg.setAttribute("y", obj.y);
    svg.setAttribute("opacity", 1.0);
    svg.style.fill=obj.colorFill;
    svg.style.stroke=obj.colorStroke;
    /*if (idx===0) {
        svg.style.fill=opt.rectColorStart;
    } else if (idx===chapters.length-1) {
        svg.style.fill=rectColorEnd;
    } else {
        svg.style.fill=opt.rectColorDefault;
    }*/
    return svg;
}

export function svgText(obj) {
    let txt = document.createElementNS(NS, 'text');
    txt.setAttribute('x', obj.x);
    txt.setAttribute('y', obj.y);
    txt.setAttribute('fill', obj.color);
    txt.setAttribute('font-family', 'Arial');
    txt.setAttribute('font-size', '16');
    txt.textContent = obj.text;
    return txt;
}

export function svgArrow(x,y1,y2,color) {
    let line = document.createElementNS(NS, 'line');
    line.setAttribute('x1',x);
    line.setAttribute('x2',x);
    line.setAttribute('y1',y1-2);
    line.setAttribute('y2',y2+2);
    line.setAttribute('stroke',color);
    line.setAttribute('stroke-width',2);
    return line;
}

export function svgCircle(x,y,colorStroke,colorFill) {
    let circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx',x);
    circle.setAttribute('cy',y);
    circle.setAttribute('r','3');
    circle.setAttribute('stroke',colorStroke);
    circle.setAttribute('fill',colorFill);
    return circle;
}