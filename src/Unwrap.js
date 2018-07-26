const Unwrap = (str) => str.split('-').join(' ');

const Wrap = (str) => str.split(" ").join('-');

export {Unwrap, Wrap};