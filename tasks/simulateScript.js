/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');
const {
  simulateScript,
  decodeResult,
} = require('@chainlink/functions-toolkit');
const {
  Location,
  ReturnType,
  CodeLanguage,
} = require('@chainlink/functions-toolkit');

task(
  'functions-simulate-script',
  'Executes the JavaScript source code locally'
).setAction(async () => {
  const checkScriptPath = path.resolve(
    __dirname,
    '../',
    'functions',
    'github-metric-times-ether.js'
  );
  const checkScript = fs.readFileSync(checkScriptPath, 'utf8');

  const requestConfig = {
    source: checkScript,
    args: [
      'https://github.com/smartcontractkit/chainlink-functions-demo-app',
      'stars',
      '1',
      '1000000000',
    ],
    codeLanguage: CodeLanguage.JavaScript,
    expectedReturnType: ReturnType.bytes,
    codeLocation: Location.Inline,
  };

  // Simulate the JavaScript execution locally
  const { responseBytesHexstring, errorString, capturedTerminalOutput } =
    await simulateScript(requestConfig);
  console.log(`${capturedTerminalOutput}\n`);
  if (responseBytesHexstring) {
    console.log(
      `Response returned by script during local simulation: ${decodeResult(
        responseBytesHexstring,
        requestConfig.expectedReturnType
      ).toString()}\n`
    );
  }
  if (errorString) {
    console.log(`Error returned by simulated script:\n${errorString}\n`);
  }
});
