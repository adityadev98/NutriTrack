require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

console.log("Jest setup file loaded!");