import globals from './globals';

const typeToInit = {
    [globals.EDIT_QUILL]: '',
    [globals.EDIT_QUIZ]: '',
    [globals.EDIT_EMBED]: {
        id: '',
    },
    [globals.EDIT_VIDEO]: {
        url: '',
        cropStart: 0.0,
        cropEnd: 0.0
    },
    [globals.EDIT_SYSTEM]: '',
    [globals.EDIT_IMAGE]: '',
    [globals.EDIT_FORMULA]: ''
}


export function isElementEmpty(data) {
    const {type, content} = data;

    const emptyContent = typeToInit[type.toString()];

    if (typeof content === 'string') {
        return content === emptyContent;
    }
    else if (typeof content === 'object' && !Array.isArray(content)) {
        const deepEqual = JSON.stringify(content) === JSON.stringify(emptyContent)
        return deepEqual;
    }
    throw Error('isElementEmpty passed an Array which is not a initContentType')
}

export function initContent(type) {
    let typeToInit = {}
    typeToInit[globals.EDIT_QUILL] = '';
    typeToInit[globals.EDIT_QUIZ] = '';
    typeToInit[globals.EDIT_EMBED] = {
        id: '',
    };
    typeToInit[globals.EDIT_VIDEO] = {
        url: '',
        cropStart: 0.0,
        cropEnd: 0.0
    };
    typeToInit[globals.EDIT_SYSTEM] = '';
    typeToInit[globals.EDIT_IMAGE] = '';
    typeToInit[globals.EDIT_FORMULA] = '';

    return typeToInit[type.toString()];
}

export function typeToString(type) {
    const dict = {};
    dict[globals.EDIT_QUILL] = 'Text';
    dict[globals.EDIT_QUIZ] = 'Quiz';
    dict[globals.EDIT_EMBED] = 'Iframe';
    dict[globals.EDIT_VIDEO] = 'Video';
    dict[globals.EDIT_IMAGE] = 'Image';
    dict[globals.EDIT_FORMULA] = 'Formula';
    return dict[type];
}

