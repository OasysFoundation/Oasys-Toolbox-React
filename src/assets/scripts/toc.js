
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
        if (graph[idx].linkIdx.length===0) {
            pathCosts.push(currentCost);
            paths.push(currentPath);
        }
        for (let i = 0; i < graph[idx].linkIdx.length; i++) {
            let child = graph[idx].linkIdx[i];
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
            id: chapters[mainPath[i]].id,
            level: i,
            next: chapters[mainPath[i]].linkIdx.filter(e=>e>=mainPath[i]),
            prev: chapters[mainPath[i]].linkIdx.filter(e=>e<mainPath[i]),
            title: chapters[mainPath[i]].title,
            linkIdx: chapters[mainPath[i]].linkIdx,
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
        let chaps = chapters.filter(e=>e.linkIdx.indexOf(idx)>=0);
        if (chaps.length===0) {
            throw new Error("While building TOC, a chapter was discovered that is disconnected (" + chapters[todo[i]].title + ")")
        }
        let prevElem = Math.max(0,...chaps.map(e=>e.idx).filter(e=>e<idx));
        // find first element this one points to
        let nextElem = Math.min(...chapters[idx].linkIdx.filter(e=>e>idx));
        // how many possible levels?
        let posrefs = tocInfo.map(e=>e.idx).filter(e=>e>prevElem&&e<nextElem);
        let poslevs = tocInfo.filter(e=>posrefs.indexOf(e.idx) >= 0).map(e=>e.level);
        // console.log(idx + ": " + prevElem + " - " + nextElem + " --> " + poslevs);
        // for now, always take the first possible level. Can there be none?
        if (poslevs.length===0) {
            throw new Error("TOC: Cannot find placement for all elements off the longest path.")
        }
        addTocInfo.push({
            idx: idx,
            id: chapters[idx].id,
            level: poslevs[0],
            next: chapters[idx].linkIdx.filter(e=>e>idx),
            prev: chapters[idx].linkIdx.filter(e=>e<idx),
            title: chapters[idx].title,
            linkIdx: chapters[idx].linkIdx,
        });
    }
    tocInfo.push(...addTocInfo);
    // find final element and make sure it is at the highest level
    let fin = tocInfo.filter(e=>e.linkIdx.length===0);
    if (fin.length===0) {
        throw new Error("No final chapter! (The final chapter cannot have any links.");
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
    let done = [];
    for (let i=1; i<=maxPrio; i++) {
        let ti = tocInfo.filter(e=>e.prio === i);
        for (let j=0; j<ti.length; j++) {
            if (done.indexOf(ti[j].level) >= 0) {
                continue;
            }
            done.push(ti[j].level);
            let allonlvl = tocInfo.filter(e=>e.level===ti[j].level);
            // let myx = allonlvl.map(e => e.x);
            for (let k=0; k<allonlvl.length; k++) {
                let elem = allonlvl[k];
                let otherElems = tocInfo.filter(e => e.linkIdx.indexOf(elem.idx) >= 0);
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
        for (let j=0; j<elem.linkIdx.length; j++) {
            let link = tocInfo[tocIdx.indexOf(elem.linkIdx[j])];
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
    return tocInfo;
}

export function drawChapters(tocInfo, chapters, opt) {
    let maxLevel = Math.max(...tocInfo.map(e=>e.level));
    let offy = 0;
    for (let i=0; i<=maxLevel; i++) {
        let offx = 0;
        let elems = tocInfo.filter(e=>e.level === i);
        if (elems.length === 1) {
            let info = {
                x: offx, 
                y: offy,  
                width: opt.totalWidth, 
                text: chapters[elems[0].idx].title,
                active: chapters[elems[0].idx].active,
            };
            document.getElementById(opt.tocId).appendChild(svgRect(info,elems[0].id,opt));
            document.getElementById(opt.tocId).appendChild(svgText(info,elems[0].id,opt));
        } else {
            let rectWidth = Math.floor((opt.totalWidth - (elems.length - 1) * opt.gapx) / elems.length);
            for (let j=0; j<elems.length; j++) {
                let info = {
                    x: offx, 
                    y: offy,  
                    width: rectWidth, 
                    text: chapters[elems[j].idx].title,
                    active: chapters[elems[j].idx].active,
                };
                document.getElementById(opt.tocId).appendChild(svgRect(info,elems[j].id,opt));
                document.getElementById(opt.tocId).appendChild(svgText(info,elems[j].id,opt));
                offx = offx + rectWidth + opt.gapx;
            }
        }
        offy = offy + opt.gapy + opt.rectHeight;
    }
}

export function drawConnections(tocInfo, opt){
    let arrowToDraw = [];
    for (let i=0; i<tocInfo.length; i++) {
        let links = tocInfo[i].linkIdx;
        for (let j=0; j<links.length; j++) {
            let elem = tocInfo.filter(e=>e.idx === links[j])[0];
            let y1 = tocInfo[i].level * (opt.gapy + opt.rectHeight);
            let y2 = elem.level * (opt.gapy + opt.rectHeight);
            let x = Math.round(opt.totalWidth*tocInfo[i].xarrow[j]);
            if (y2<y1) {
                y1 -= 1;
                y2 += opt.rectHeight + 1;
            } else {
                y1 += opt.rectHeight + 1;
                y2 -= 1;
            }
            let level1 = Math.min(tocInfo[i].level,elem.level);
            let level2 = Math.max(tocInfo[i].level,elem.level);
            for (let k=1; k<level2-level1; k++) {
                drawTunnel(level1+k,x,opt);
            }
            arrowToDraw.push({x:x,y1:y1,y2:y2});
        }
    }
    arrowToDraw.forEach(e=>drawArrow(e.x,e.y1,e.y2,opt));
}

export function drawTunnel(level,x,opt) {
    let y1 = level * (opt.rectHeight + opt.gapy);
    let y2 = y1 + opt.rectHeight;
    document.getElementById(opt.tocId).appendChild(svgBezier(x-6,x+6,y1-7,y1+1,opt.rectColorDefaultFill,opt.rectColorDefaultStroke));
    document.getElementById(opt.tocId).appendChild(svgBezier(x-6,x+6,y2-7,y2+1,opt.backgroundColor,opt.rectColorDefaultStroke));
}

export function svgBezier(x1,x2,y1,y2,colorFill,colorStroke) {
    // play with beziers: http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
    // the path command consists of the starting point specified by M followed by x and y coords
    // the C starts a bezier curve, which consists of three additional points (and their respective x and y coords): 
    // bezier 1, bezier 2, and end point. Have a lok at the example to understand the bezier points.
    // <path d="M100,250 C100,100 400,100 400,250" />
    //let poly = document.createElementNS(NS, 'polygon');
    //poly.setAttribute('fill', opt.arrowColor);
    //poly.setAttribute('points', `${x1},${y1} ${x},${y2}, ${x2},${y1}`);
    let elem = document.createElementNS(NS, 'path');
    elem.setAttribute('d', `M${x1},${y2} C${x1},${y1} ${x2},${y1} ${x2},${y2}`);
    elem.setAttribute('fill', colorFill);
    elem.setAttribute('stroke', colorStroke);
    return elem;
}


export function drawArrow(x,y1,y2,opt) {
    let reverse = false;
    if (y1<y2) {
        let color = opt.arrowColor;
        if (Math.abs(y2-y1)>opt.rectHeight) {
            color = opt.arrowLongColor;
        }
        document.getElementById(opt.tocId).appendChild(svgArrow(x, y1-3, y2, color, reverse, opt));
        document.getElementById(opt.tocId).appendChild(svgPoly(x, y2-6, y2+4, color, reverse, opt));
    } else {
        reverse = true; 
        let color = opt.arrowColorReverse;
        if (Math.abs(y2-y1)>opt.rectHeight) {
            color = opt.arrowLongColorReverse;
        }
        document.getElementById(opt.tocId).appendChild(svgArrow(x, y1+3, y2, color, reverse, opt));
        document.getElementById(opt.tocId).appendChild(svgPoly(x, y2-6, y2+4, color, reverse, opt));
    }
}

export function svgRect(obj,idx,opt){
    let svg = document.createElementNS(NS,"rect");
    svg.width.baseVal.value=obj.width;
    svg.height.baseVal.value=opt.rectHeight;
    svg.setAttribute("x", obj.x);
    svg.setAttribute("y", obj.y);
    svg.setAttribute("rx", '0.25rem'); // corner radius horizontal
    svg.setAttribute("ry", '0.25rem'); // corner radius vertical
    svg.setAttribute("opacity", 1.0);
    svg.setAttribute('data-tip', 'tooltip');
    svg.setAttribute('data-for', 'toc-'+idx);
    svg.addEventListener("click", function(){opt.handleClick(idx)}, false);
    if (obj.active) {
        svg.style.fill = opt.rectColorActiveFill;
    } else {
        svg.style.fill = opt.rectColorDefaultFill;
    }
    svg.style.stroke = opt.rectColorDefaultStroke;
    svg.style.cursor = 'pointer';
    /*if (idx===0) {
        svg.style.fill=opt.rectColorStart;
    } else if (idx===chapters.length-1) {
        svg.style.fill=rectColorEnd;
    } else {
        svg.style.fill=opt.rectColorDefault;
    }*/
    return svg;
}

export function svgText(obj,idx,opt) {
    let svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('x', obj.x);
    svg.setAttribute('y', obj.y);
    svg.setAttribute('width', obj.width - opt.textpadx);
    svg.setAttribute('height', opt.rectHeight);
    svg.setAttribute('data-tip', 'tooltip');
    svg.setAttribute('data-for', 'toc-'+idx);

    let txt = document.createElementNS(NS, 'text');
    txt.setAttribute('x', opt.textpadx);
    txt.setAttribute('y', opt.textpady+15);
    txt.setAttribute('fill', opt.textColor);
    svg.setAttribute('data-tip', 'tooltip');
    svg.setAttribute('data-for', 'toc-'+idx);
    txt.style.cursor = 'pointer';
    txt.textContent = obj.text;

    svg.addEventListener("click", function(){opt.handleClick(idx)}, false);

    svg.appendChild(txt);
    return svg;
}

export function svgPoly(x,y1,y2,color,reverse,opt) {
    let poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('fill', color);
    if (reverse) {
        poly.setAttribute('points', `${x-5},${y2} ${x},${y1}, ${x+5},${y2}`);
    } else {
        poly.setAttribute('points', `${x-5},${y1} ${x},${y2}, ${x+5},${y1}`);
    }
    return poly;
}

export function svgArrow(x,y1,y2,color,reverse,opt) {
    let line = document.createElementNS(NS, 'line');
    line.setAttribute('x1',x);
    line.setAttribute('x2',x);
    line.setAttribute('y1',y1);
    line.setAttribute('y2',y2);
    line.setAttribute('stroke',color);
    line.setAttribute('stroke-width',opt.arrowStroke);
    if (reverse) {
        let dashDraw = opt.gapy+4;
        let dashGap  = opt.rectHeight+5;
        line.setAttribute('stroke-dasharray', dashDraw.toString() + ' ' + dashGap.toString());
    } else {
        let dashDraw = opt.gapy-5;
        let dashGap  = opt.rectHeight+5;
        line.setAttribute('stroke-dasharray', dashDraw.toString() + ' ' + dashGap.toString());
    }
    // poly.setAttribute('stroke', colorStroke);
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