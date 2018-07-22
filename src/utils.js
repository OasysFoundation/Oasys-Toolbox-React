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

function flatten(arr, depth =0) {
    //make recursive at some point...
    return arr.reduce((acc, current) => acc.concat(current))
}

function substringInObjCount(obj, substr) {
    return Object.values(obj)
        .filter(c => typeof c === 'string')
        .filter(s => s.toLowerCase().includes(substr.trim().toLowerCase()))
        .length
}



export {NUcheck, substringInObjCount, flatten, CATEGORIES, getTagsForCategory}