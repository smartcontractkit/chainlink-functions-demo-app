const fs = require('fs');
const path = require('node:path');
const { networks } = require('./networks');
const functionsPath = path.resolve(__dirname, 'functions');
const checkScriptPath = path.resolve(
  functionsPath,
  'get-wallet-and-repos-from-gist.js'
);
const calculateScriptPath = path.resolve(
  functionsPath,
  'github-metric-times-ether.js'
);
const checkScript = fs.readFileSync(checkScriptPath, {
  encoding: 'utf-8',
});
const calculateScript = fs.readFileSync(calculateScriptPath, {
  encoding: 'utf-8',
});
module.exports = [
  networks.mumbai.functionsOracleProxy,
  // calculateScript,
  // checkScript,
];
