const glb = {
	QUILL: 0,
	QUIZ: 1,
	GAME: 2,
	IF_START : 0, // immediately after if command
	IF_COND  : 1, // inside if condition (but not immediately after if command)
	IF_BODY  : 2, // inside if body (also, prior to next if command)
	BOOL_DISABLED : 0, 
	BOOL_ENABLED : 1,
};

export default glb;