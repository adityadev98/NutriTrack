module.exports = {
   transform: {
     '^.+\\.jsx?$': 'babel-jest',
   },
   testEnvironment: 'node',
   rootDir: __dirname, // Ensures Jest runs only in NutriTrack-Backend
   testMatch: ["<rootDir>/NutriTrack-Backend/__tests__/**/*.[jt]s?(x)", "<rootDir>/?(*.)+(spec|test).[jt]s?(x)"],
   testPathIgnorePatterns: ["<rootDir>/../NutriTrack-Frontend/"],
 };