export function Unwrap(wrappedString) {
	return wrappedString.replace(/-/g,' ');
}

export function Wrap(wrappedString) {
	return wrappedString.replace(/ /g,'-');
}