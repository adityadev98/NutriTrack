export const transform = {
   "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
};
export const testEnvironment = 'jsdom';
export const setupFiles = ['../<rootDir>/jest.setup.js'];