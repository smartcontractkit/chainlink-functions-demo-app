// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./dev/functions/FunctionsClient.sol";

contract GitHubFunctions is FunctionsClient {
  using Functions for Functions.Request;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  string public calculationLogic;
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  constructor(address oracle, string memory _calculationLogic) FunctionsClient(oracle) {
    calculationLogic = _calculationLogic;
  }

  function multiplyMetricWithEther(
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, calculationLogic);
    req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    emit OCRResponse(requestId, response, err);
  }
}
