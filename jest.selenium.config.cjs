module.exports = {
   transform: {
     '^.+\\.jsx?$': 'babel-jest',
   },
   testEnvironment: 'node',
   rootDir: __dirname,
   testMatch: ["<rootDir>/e2e_test/**/*.[jt]s?(x)"],  // Ensures Jest runs only in e2e_test folder
 };