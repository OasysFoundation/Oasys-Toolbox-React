const globals = {
	//change if somebody committed with the wrong setting!!
	//.env ENV_NODE
    // HARDSET_BASE: "http://localhost:8080/",
    ICON_FONTSIZE_MIDDLE: "22px",
    ICON_FONTSIZE_NORMAL: "18px",
    SESSIONSTORAGE_KEY: `__OASYS_ID__`,

	HARDSET_BASE: "https://api.joinoasys.org/",

    API_DEV_LOCAL: 'http://localhost:8080/',
	API_PROD: 'https://api.joinoasys.org/',
	API_DEV_REMOTE:'https://death.joinoasys.org/',
	OASYS_API_BASE: 'https://api.joinoasys.org/',
	OASYS_APP_BASE: 'https://app.joinoasys.org/',
	// types of editors
	EDIT_QUILL: 0,
	EDIT_QUIZ: 1,
	EDIT_EMBED: 2,
	EDIT_VIDEO: 3,
	EDIT_SYSTEM: 4,
	EDIT_IMAGE: 5,
	EDIT_FORMULA: 6,
	// for module editor
	IF_START : 0, // for module component logic: immediately after if command
	IF_COND  : 1, // for module component logic: inside if condition (but not immediately after if command)
	IF_BODY  : 2, // for module component logic: inside if body (also, prior to next if command)
	BOOL_DISABLED : 0, // for module component logic
	BOOL_ENABLED : 1, // for module component logic
};



export default globals;