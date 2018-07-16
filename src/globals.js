const globals = {
	QUILL: 0,
	QUIZ: 1,
	GAME: 2,
	HYPERVIDEO: 3,
	IF_START : 0, // for module component logic: immediately after if command
	IF_COND  : 1, // for module component logic: inside if condition (but not immediately after if command)
	IF_BODY  : 2, // for module component logic: inside if body (also, prior to next if command)
	BOOL_DISABLED : 0, // for module component logic
	BOOL_ENABLED : 1, // for module component logic
};

export default globals;