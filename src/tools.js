import globals from './globals';

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
	return typeToInit[type];
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

