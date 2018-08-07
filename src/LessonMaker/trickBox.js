// ([1,2,3,4], 2) ===> [1,2,4]
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
        console.info(`BB keys of obj`, curr, `
            KEYS ::: ${keys}`)
        keys.forEach(k => {
            console.log('SS key', k)
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


export {withoutEntry, isEmpty, getObjectsByKey, flatten, moveEntry}