// ([1,2,3,4], 2) ===> [1,2,4]

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
        (value.hasOwnProperty('length') && value.length === 0)
        || value.constructor === Object && Object.keys(value).length === 0
    );
}


//@  moveEntry([1,2,3,4,5], 2, -2) ==> [3,1,2,4,5]
const moveEntry = function (array, entryIndex, change) {
    if (!(Number.isInteger(entryIndex) && Number.isInteger(change))) {
        throw new Error('entryIndex or change are is not an integer')
    }
    const nextIndex = entryIndex + change;
    if (nextIndex < 0 || nextIndex >= array.length) {
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





export {Unwrap, Wrap,
    NUcheck, substringInObjCount,
    flatten, CATEGORIES,
    getTagsForCategory,
    withoutEntry, isEmpty, getObjectsByKey, moveEntry}