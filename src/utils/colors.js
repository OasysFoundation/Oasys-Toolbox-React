const colors = {
	SNOW1: "#f8f8f4",
	SNOW2: "#f4f4e8",
	WINTERSUN: "#f4efb6",
	LOCHINVAR: "#2a9699",
	SUMMERSUN: "#f6bd4a",
	VELVET: "#c6361d",
	GREEN: "#2fc46d",
	BLUESTEEL: "#27363e",
	PURPLE: "#a34079",
	BROWN: "#b48652",
	RUST: "#9f5032",
	TURQUOISE: "#28ccb4",
	MOUNTBATTEN: "#a47d90",
	DARKGREY: "#3e4b54",
	GREY: "#626970",
	GULLGREY: "#a2abb8",
	GHOST: "#c3c8d4",
	SPANISHWHITE: "#f6f1de"
};

export function hexToRgb(hex) {
    var result = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export function hexToRgba(hex, opacity) {
	let rgb = hexToRgb(hex);
	let colorStr = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+opacity+')'; 
	return colorStr;
}

export default colors;