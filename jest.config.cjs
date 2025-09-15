// /** @type {import('jest').Config} */
// module.exports = {
//   testEnvironment: 'node',
//   transform: {},
// };



/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
};
