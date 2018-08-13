import globals from './globals';

export default function initContent(type) {
	let typeToInit = {}
	typeToInit[globals.EDIT_QUILL] = '';
	typeToInit[globals.EDIT_QUIZ] = '';
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

