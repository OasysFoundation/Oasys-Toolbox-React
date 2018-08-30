import globals from "./globals"
import React from 'react';

import GameIcon from "../assets/icons/Game.png"
import TextIcon from "../assets/icons/Text.png"
import SysIcon from "../assets/icons/SystemSimulation.png"
import QuizIcon from "../assets/icons/Quiz.png"
// import ImageIcon from "../assets/icons/.png"
// import FormulaIcon from "../assets/icons/F.png"

const saveToSessionStorage = function(id, value) {
    //webStorage API only saves strings
    sessionStorage.setItem(
        globals.SESSIONSTORAGE_KEY + id,
        JSON.stringify({content: value, timestamp: Date.now()})
    )
}

const getContentFromSessionStorage = function(id) {
    if (isEmpty(id)) {
        throw Error('Empty ID, cannot get content from Session')
    }
    return JSON.parse(sessionStorage.getItem(globals.SESSIONSTORAGE_KEY + id))
};

const ICON = function (className, fontSize = globals.ICON_FONTSIZE_MIDDLE) {
    return <i style={{fontSize: fontSize, color: '#626970'}} className={className}> </i>;
}


//inhaleSessionStorage() {

    // const proj = JSON.parse(JSON.stringify(this.state.project));
    //
    // //deep searches data and returns 1D array with objects that have an ID property
    // //by reference!
    // const allWithID = getObjectsByKey([proj], 'id');
    // const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(globals.SESSIONSTORAGE_KEY))
    // //get
    // sessionKeys.forEach(key => {
    //     const match = allWithID.find(el => globals.SESSIONSTORAGE_KEY + el['id'] === key)
    //     if (match) {
    //         match.content = JSON.parse(sessionStorage.getItem(key)).content;
    //     }
    // })
    // this.setState({project: proj});
//}

const typeToIcon = (type) => {
    switch (type) {
        case globals.EDIT_QUILL:
            return TextIcon;
        case globals.EDIT_GAME:
            return GameIcon
        case globals.EDIT_SYSTEM:
            return SysIcon
        case globals.EDIT_QUIZ:
            return QuizIcon
        default:
            return <div>ICON or TYPE NOT FOUND</div>
    }
}



const Unwrap = (str) => str.split('-').join(' ');

const Wrap = (str) => str.split(" ").join('-');


const withoutEntry = function (arr, entryIndex) {
    if (entryIndex >= arr.length || 0 > entryIndex) {
        throw new Error('index too big/small for array')
    }
    return [...arr.slice(0, entryIndex), ...arr.slice(entryIndex + 1)];
}

const isEmpty = function(value) {
    return (
        value === undefined || value===null ||
        (value.hasOwnProperty('length') && value.length === 0) || (value.constructor === Object && Object.keys(value).length === 0)
    );
}


//@  moveEntry([1,2,3,4,5], 2, -2) ==> [3,1,2,4,5]
const moveEntry = function (array, entryIndex, change) {
    if (!(Number.isInteger(entryIndex) && Number.isInteger(change))) {
        throw new Error('entryIndex or change are is not an integer')
    }
    const nextIndex = entryIndex + change;
    if (nextIndex < 0 || nextIndex >= array.length - 1) {
        return array;
    }
    const others = withoutEntry(array, entryIndex);

    return [
        ...others.slice(0, nextIndex),
        array[entryIndex], //the actual value / entry
        ...others.slice(nextIndex)
    ]
};

//@ [1,2, {a: 5, id: 2, el: [{r:3, id:3}]}, {e:3}] ==> [{a:5, id:2, el: [...]} , {r:3, id:3} }
function getObjectsByKey(arr, key) {
    return arr.reduce((prev, curr) => {
        const keys = Object.keys(curr);
        keys.forEach(k => {
            if (Array.isArray(curr[k])) prev = prev.concat(getObjectsByKey(curr[k], key));
            if (k === key) prev = prev.concat(curr);
        });
        return prev;
    }, [])
}

//@ Flattens a nested array into a 1D array
//@ example : [1,2,[34,5,["#$",'^']]] => [23,213,12,312,31,2321]
const flatten = function flatten(arr) {
    return arr.reduce(function (a, b) {
        return a.concat(Array.isArray(b) ? flatten(b) : b);
    }, []);
};


const CATEGORIES = {
    computerscience: ['object', 'programming', 'ml', 'swift', 'code'],
    chemistry: ['chemistry', 'atom', 'molecule'],
    physics: ['physic', 'simulation', 'work'],
}

function getTagsForCategory(category) {
    const str = category.trim().toLowerCase();
    return CATEGORIES[str] || [];
};

function NUcheck(data, depth=0, notAllowed=[null, undefined]) {
    if (depth < 0) {
        return false
    }
    const next = [];
    for (let [key, value] of Object.entries(data)) {
        console.log(key, value, depth)
        if (notAllowed.includes(value)) {
            console.log(`BAD: ${value} @ key:${key} @ Level T-${depth}`)
            return true
        } //== intended | abstract equality operator
        if (typeof value === 'object') {
            next.push(value);
        }
    }
    return NUcheck(flatten(next), depth-1)
}

// function shallowFlatten(arr, depth =0) {
//     //make recursive at some point...
//     return arr.reduce((acc, current) => acc.concat(current))
// }

function substringInObjCount(obj, substr) {
    return Object.values(obj)
        .filter(c => typeof c === 'string')
        .filter(s => s.toLowerCase().includes(substr.trim().toLowerCase()))
        .length
}





export {Unwrap, Wrap, ICON,
    NUcheck, substringInObjCount, saveToSessionStorage, getContentFromSessionStorage,
    flatten, CATEGORIES,
    getTagsForCategory, typeToIcon,
    withoutEntry, isEmpty, getObjectsByKey, moveEntry}